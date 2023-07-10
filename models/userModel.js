const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'user should have a name'],
  },
  email: {
    type: String,
    required: [true, 'user should have an email'],
    unique:true,
    lowercase:true
  },
  role:{
    type:String,
    enum:['user','guide','lead-guide','admin'],
    default:'user'
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'user should have a password'],
  },
  confirmPassword: {
    type: String,
    required: [true, 'please enter confirm password'],
  },
  passwordChangedAt:{
    type:Date
  },
  passwordResetToken:{
    type:String
  },
  passwordExpires:{
    type:Date
  },
  passwordVerifiedCode:{
    type:Boolean
  },
  active:{
    type:Boolean,
    default:true,
    select:false
  }
});
userSchema.pre("save",function(next){
  if(!this.isModified('password')) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});
userSchema.pre(/^find/,function(next){
  this.find({active:{$ne:false}});
  next();
})
userSchema.pre("save",async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,12);
    this.confirmPassword = undefined;
    next();
});
// userSchema.methods.checkPassword = async function(candidatePassword,userPassword){
//   await bcrypt.compare(candidatePassword,userPassword);
// }

module.exports = mongoose.model('User', userSchema);