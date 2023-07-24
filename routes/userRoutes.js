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

router
  .route('/')
  .get(authController.protect,authController.restrictTo('admin'),userController.getAllUsers);
router
  .route('/:id')
  .get(authController.protect,authController.restrictTo('admin'),findUserValidator, checkValidator, userController.getUser)
  .patch(authController.protect,authController.restrictTo('admin'),updateUserValidator, checkValidator, userController.updateUser)
  .delete(authController.protect,authController.restrictTo('admin'),deleteUserValidator, checkValidator,userController.deleteUser);

router
  .route('/changePassword/:id')
  .put(
    userChangePasswordValidator,
    checkValidator,
    userController.userChangePassword
  );

module.exports = router;