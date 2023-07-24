const bcrypt = require("bcrypt");
const {promisify} = require("util");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const AppError = require("../midlleware/utils/appError");
const catchAsync = require("../midlleware/utils/catchAsync");
const User = require("../models/userModel");
const sendEmail = require("../midlleware/utils/sendEmail");

const createSendToken = (response, statusCode, user) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_TOKEN, {
    expiresIn: process.env.EXPIRES_DATE,
  });
  const cookieOptions ={
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN*24*60*60*1000),
    httpOnly:true
  };
  if(process.env.NODE_ENV === 'production'){
    cookieOptions.secure = true
  }
  response.cookie("token", token, cookieOptions);
  user.password = undefined;
  response.status(statusCode).json({
    status: "success",
    user,
    token,
  });
};

exports.signUp = catchAsync(async(request,response,next)=>{
    const user = await User.create(request.body);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_TOKEN, {
      expiresIn: process.env.EXPIRES_DATE,
    });
    response.status(201).json({
      status: 200,
      message: 'sign up successfully',
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
  createSendToken(response,200,user);
});
exports.getLoggedUserData = catchAsync(async(request,response,next)=>{
  request.params.id = request.user.id;
  next();
})
exports.updateLoggedUserPassword = catchAsync(async(request,response,next)=>{
  const user = await User.findByIdAndUpdate(request.user.id,{
    password:await bcrypt.hash(request.body.password,12),
    passwordChangedAt:Date.now(),
  },{new:true});
  if(!user){
    return next(new AppError("invalid user please login in",400))
  }
  createSendToken(response, 200, user);
  // const user = await User.findById(request.user.id);
  // if(!(await user.checkPassword(request.body.confirmPassword,user.password))){
  //   return next(new AppError("your current password was wrong",401))
  // }
  // user.password = request.body.password;
  // user.confirmPassword = request.body.confirmPassword;
  // await user.save();

  // response.status(200).json({
  //   status:"success",
  //   data:{
  //     user
  //   }
  // })
});

exports.updateLoggedUserData = catchAsync(async(request,response,next)=>{
  if(request.body.password || request.body.confirmPassword){
    return next(new AppErrro("you cant change password or confirm password please use updateMyPassword/",400));
  }
  const user = await User.findByIdAndUpdate(request.user.id,{
    name:request.body.name
    
  },{new:true});
  response.status(200).json({
    status:"success",
    data:{
      user
    }
  })
});

exports.deActivateLoggedUser = catchAsync(async(request,response,next)=>{
  const user = await User.findByIdAndUpdate(request.user.id,{
    active:false
  },{new:true});
  if(!user){
    return next(new AppError("invalid user email",400));
  }
  response.status(200).json({
    status:"success",
    message:"deleted",
    data:null
  })
});
