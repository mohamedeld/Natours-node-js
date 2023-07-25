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
router.use(authController.protect);
router.route('/forgotPassword').post(authController.forgotPassword);
router
  .route("/resetPassword/:token")
  .patch(authController.resetPassword);

router.route('/updateLoggedPassword').patch(authController.updateLoggedUserPassword);
router.route('/updateMe').patch(authController.updateLoggedUserData);
router
  .route("/deactivate")
  .delete(authController.deActivateLoggedUser);
  
module.exports = router;
