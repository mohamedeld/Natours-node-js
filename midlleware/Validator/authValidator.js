const { query, param, body } = require('express-validator');
const User = require("../../models/userModel");
module.exports.signUpValidator = [
  body('name')
    .notEmpty()
    .withMessage('please enter your name')
    .isLength({ min: 6, max: 25 })
    .withMessage('please enter from 6 to 25 chars'),
  body('email')
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
  body('password')
    .notEmpty()
    .withMessage('please enter your pasword')
    .isStrongPassword()
    .withMessage('please enter a strong password')
    .custom((val, { req }) => {
      if (val !== req.body.confirmPassword) {
        return Promise.reject(
          new Error('password does not match confirm password')
        );
      }
      return true;
    }),
  body('confirmPassword')
    .notEmpty()
    .withMessage('please enter a confirm passwordd'),
];

module.exports.loginValidator = [
  body('email')
    .notEmpty()
    .withMessage('please enter your email')
    .isEmail()
    .withMessage('please enter a valid email')
    .custom((val, { req }) => {
      return User.findOne({ email: val }).then((user) => {
        if (!user) {
          return Promise.reject(new Error('invalid email please sign up'));
        }
      });
    }),
  body('password')
    .notEmpty()
    .withMessage('please enter your password')
    .isStrongPassword()
    .withMessage('please enter a strong password'),
];