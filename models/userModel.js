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
  }
});
userSchema.pre("save",async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,12);
    this.confirmPassword = undefined;
    next();
});
module.exports = mongoose.model('User', userSchema);