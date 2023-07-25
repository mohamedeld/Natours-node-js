const express = require("express");
const userController = require("../controller/userController");
const authController =require("../controller/authController");

const {
  
  findUserValidator,
  userChangePasswordValidator,
  updateUserValidator,
  deleteUserValidator,
} = require('../midlleware/Validator/userValidator');
const checkValidator = require("../midlleware/Validator/checkValidtor");

const router = express.Router();
router.use(authController.protect);

router.route('/me',userController.getMe,userController.getUser);
router
  .route('/')
  .get(authController.restrictTo('admin'),userController.getAllUsers);
router
  .route('/:id')
  .get(authController.restrictTo('admin'),findUserValidator, checkValidator, userController.getUser)
  .patch(authController.restrictTo('admin'),updateUserValidator, checkValidator, userController.updateUser)
  .delete(authController.restrictTo('admin'),deleteUserValidator, checkValidator,userController.deleteUser);

router
  .route('/changePassword/:id')
  .put(
    userChangePasswordValidator,
    checkValidator,
    userController.userChangePassword
  );


module.exports = router;