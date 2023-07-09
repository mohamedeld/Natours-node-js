const express = require("express");
const userController = require("../controller/userController");
const {
  createUserValidator,
  findUserValidator,
  userChangePasswordValidator,
  updateUserValidator,
  deleteUserValidator,
} = require('../midlleware/Validator/userValidator');
const checkValidator = require("../midlleware/Validator/checkValidtor");
const router = express.Router();

router
  .route('/')
  .get(userController.getAllUsers)
  .post(createUserValidator, checkValidator,userController.createUser);
router
  .route('/:id')
  .get(findUserValidator, checkValidator, userController.getUser)
  .patch(updateUserValidator, checkValidator, userController.updateUser)
  .delete(deleteUserValidator, checkValidator,userController.deleteUser);

router
  .route('/changePassword/:id')
  .put(
    userChangePasswordValidator,
    checkValidator,
    userController.userChangePassword
  );

module.exports = router;