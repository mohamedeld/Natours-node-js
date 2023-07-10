const {promisify} = require("util");
const AppError = require("../midlleware/utils/appError");
const catchAsync = require("../midlleware/utils/catchAsync");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const sendEmail = require("../midlleware/utils/sendEmail");
const crypto = require("crypto");
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
exports.forgotPassword = catchAsync(async(request,response,next)=>{
    const user = await User.findOne({email:request.body.email});
    if(!user){
        return next(new AppError("invalid email",401))
    }
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    const hashResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetToken =hashResetToken;
    user.passwordExpires= Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const resetURL = `${request.protocol}://${request.get('host')}/api/v1/auth/resetPassword/${resetToken}`;
    try{
      await sendEmail({
      email:user.email,
      subject:'your password reset token (valid for 10 minutes)',
      text:`Forgot your password? Submit a PATCH request with your new password and password confirm to : ${resetURL} \n if you did not please ignore this message`
    })
    response.status(200).json({
      stauts:"success",
      message:'please check your email'
    })
    }catch(err){
      user.passwordResetToken=undefined;
      user.passwordExpires= undefined; 
      await user.save({validateBeforeSave:false});
      return next(new AppError("an error through sending email try later",500));
    }
    
})

exports.resetPassword = catchAsync(async(request,response,next)=>{
  const hashedToken = crypto.createHash('sha256').update(request.params.token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordExpires: { $gt: Date.now() },
  });
  if(!user){
    return next(new AppError("invalid token please try later",400));
  }
  user.password = request.body.newPassword;
  user.confirmPassword = request.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordExpires = undefined;
  await user.save();
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_TOKEN, {
    expiresIn: process.env.EXPIRES_DATE,
  });
  response.status(200).json({
    status:"success",
    token
    
  })
})