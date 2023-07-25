const bcrypt = require("bcrypt");
const AppError = require("../midlleware/utils/appError");
const catchAsync = require("../midlleware/utils/catchAsync");
const User = require("../models/userModel");
const factory = require('./handlerFactory');


exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.createUser = factory.createOne(User);

exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

exports.getMe = catchAsync((request,response,next)=>{
  request.params.id = request.user.id;
  next();
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
});