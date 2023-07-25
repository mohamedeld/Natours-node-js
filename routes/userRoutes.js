const express = require("express");
const userController = require("../controller/userController");
const authController =require("../controller/authController");

const {
  createUserValidator,
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
  .route('/changePassword/:id')
  .put(
    userChangePasswordValidator,
    checkValidator,
    userController.userChangePassword
  );


router.use(authController.restrictTo('admin'));
router
  .route('/')
  .get(userController.getAllUsers).post(checkValidator,userController.createUser);
router
  .route('/:id')
  .get(findUserValidator, checkValidator, userController.getUser)
  .patch(updateUserValidator, checkValidator, userController.updateUser)
  .delete(deleteUserValidator, checkValidator,userController.deleteUser);



module.exports = router;