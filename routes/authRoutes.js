const express = require("express");
const authController = require("../controller/authController");
const {
  signUpValidator,
  loginValidator,
} = require('../midlleware/Validator/authValidator');
const router = express.Router();
const checkValidator = require("../midlleware/Validator/checkValidtor");

router.route('/signup').post(signUpValidator, checkValidator, authController.signUp);
router.route('/login').post(loginValidator, checkValidator, authController.login);
router.route('/forgotPassword').post(authController.forgotPassword);
router
  .route("/resetPassword/:token")
  .patch(authController.resetPassword);
module.exports = router;
