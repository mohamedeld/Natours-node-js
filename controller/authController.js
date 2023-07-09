const {promisify} = require("util");
const AppError = require("../midlleware/utils/appError");
const catchAsync = require("../midlleware/utils/catchAsync");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
exports.signUp = catchAsync(async(request,response,next)=>{
    const user = await User.create(request.body);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_TOKEN, {
      expiresIn: process.env.EXPIRES_DATE,
    });
    response.status(201).json({
      status: 'success',
      data: {
        user,
        token
      },
    });
});


exports.login = catchAsync(async(request,response,next)=>{
    const user = await User.findOne({ email: request.body.email });
    if (!user) {
      return next(new AppError('invalid email address please sign up', 401));
    }
    const validPassword = await bcrypt.compare(request.body.password,user.password);
    if (!validPassword) {
      return next(new AppError('invalid password', 401));
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_TOKEN, {
      expiresIn: process.env.EXPIRES_DATE,
    });
    response.status(201).json({
      status: 200,
      message: 'login successfully',
      data: {
        user,
        token
      },
    });
});

exports.protect = catchAsync(async(request,response,next)=>{
    let token;
    if(request.headers.authorization && request.headers.authorization.startsWith('Bearer')){
        token = request.headers.authorization.split(" ")[1];
    }
    
    if(!token){
        return next(new AppError("invalid token please try again",401))
    }
    const decoded = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET_TOKEN
    ); 
    
    const currentUser = await User.findById(decoded.id);
    if(!currentUser){
        return next(new AppError('user does not exist', 401));
    }
    if (currentUser.passwordChangedAt){
        let convertDateToTimestamp = parseInt(
          currentUser.passwordChangedAt.getTime() / 1000,
          10
        );
        if(convertDateToTimestamp > decoded.iat){
            response.status(401).json({
              message: 'the user change his password please login again',
            });
        }
    }
    request.user = currentUser;
    next();
});

exports.restrictTo = (...roles)=>{
    return (request,response,next)=>{
        console.log(request.user.role);
        if(!roles.includes(request.user.role)){
            return next(new AppError("you don't have permission for this role",403))
        }
        next();
    }
}