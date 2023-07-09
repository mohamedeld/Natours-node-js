const AppError = require("../midlleware/utils/appError");
const catchAsync = require("../midlleware/utils/catchAsync");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

exports.getAllUsers = catchAsync(async (request, response, next) => {
  const users = await User.find();
  response.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});
exports.getUser = catchAsync(async (request, response,next) => {
  const user = await User.findById(request.params.id);
  if (!user) {
    return next(new AppError('cant find user with this id', 404));
  }
  response.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
exports.createUser = catchAsync(async (request, response, next) => {
  const user = await User.create(request.body);
  response.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
exports.userChangePassword = catchAsync(async (request, response,next)=>{
  const user = await User.findByIdAndUpdate(
    request.params.id,
    {
      password: await bcrypt.hash(request.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );
  response.status(200).json({
    status:"success",
    message:"password change successfully",
    data:{
      user
    }
  })
})
exports.updateUser = catchAsync(async(request, response, next) => {
  const user = await User.findByIdAndUpdate(request.params.id,request.body,{new:true});
  if (!user) {
    return next(new AppError('cant find user with this id', 404));
  }
  response.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
exports.deleteUser = catchAsync(async(request, response, next) => {
  const user = await User.findByIdAndDelete(request.params.id);
  if (!user) {
    return next(new AppError('cant find user with this id', 404));
  }
  response.status(200).json({
    status: 'success',
    message:"deleted"
  });
});
