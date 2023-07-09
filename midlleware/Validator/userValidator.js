const { query, param, body } = require('express-validator');
const User = require("../../models/userModel");
const bcrypt = require("bcrypt");
module.exports.createUserValidator = [
    body("name").notEmpty().withMessage('please enter your name').isLength({min:6,max:25}).withMessage("please enter from 6 to 25 chars"),
    body("email").notEmpty().withMessage('please enter your email').isEmail().withMessage("please enter a valid email").custom((val,{req})=>{
        return User.findOne({email:val}).then((user)=>{
            if(user){
                return Promise.reject(new Error("email already in use"));
            }
        })  
    }),
    body("photo").optional().notEmpty().withMessage("please enter your photo"),
]

module.exports.findUserValidator = [
  param('id')
    .notEmpty()
    .withMessage('please enter your id')
    .isMongoId()
    .withMessage('please enter correct id'),
];

module.exports.userChangePasswordValidator = [
  param("id").notEmpty().withMessage("please enter user id").isMongoId().withMessage("ivalid id"),
  body("currentPassword").notEmpty().withMessage("please enter current password"),
  body("confirmPassword").notEmpty().withMessage("please enter confirm password"),
  body("password").notEmpty().withMessage("please enter your new password").custom(async (password,{req})=>{
    const user = await User.findById(req.params.id);
    if(!user){
      throw new Error("invalid user");
    }
    const correctPassword = await bcrypt.compare(req.body.currentPassword,user.password);
    if(!correctPassword){
      throw new Error('invalid password');
      
    }
    if(password !== req.body.confirmPassword){
      throw new Error('confirm password didnt match password');
    }
    return true;
  }),
]

module.exports.updateUserValidator = [
  body('name')
    .optional()
    .notEmpty()
    .withMessage('please enter your name')
    .isString()
    .withMessage('please enter your valid name')
    .isLength({ min: 6, max: 25 }),
  body('email')
    .optional()
    .notEmpty()
    .withMessage('please enter your email')
    .isEmail()
    .withMessage('please enter a valid email')
    .custom((val, { req }) => {
      return User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error('email already in use'));
        }
      });
    }),
  body('photo').optional().notEmpty().withMessage('please enter your photo'),
  
];

module.exports.deleteUserValidator = [
  param('id')
    .notEmpty()
    .withMessage('please enter your id')
    .isMongoId()
    .withMessage('please enter correct id'),
];