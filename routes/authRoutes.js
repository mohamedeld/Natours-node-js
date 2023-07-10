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

router.route('/updateLoggedPassword').patch(authController.protect,authController.updateLoggedUserPassword);
router.route('/updateMe').patch(authController.protect,authController.updateLoggedUserData);
router
  .route("/deactivate")
  .delete(authController.protect, authController.deActivateLoggedUser);
  
module.exports = router;
