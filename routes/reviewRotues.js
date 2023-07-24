const express= require('express');
const reviewController = require('../controller/reviewController');
const checkValidator = require('../midlleware/Validator/checkValidtor');
const authController = require('../controller/authController')
const {createReviewValidator,getReviewValidator,updateReviewValidator,deleteReviewValidator} = require('../midlleware/Validator/reviewValiator');

const router = express.Router();

router.use(authController.protect);
router.route('/').get(checkValidator,reviewController.getAllReviews).post(authController.restrictTo('user'),createReviewValidator,checkValidator,reviewController.createReview);

router.route('/:id').get(authController.restrictTo('user'),getReviewValidator,checkValidator,reviewController.getReview).patch(authController.restrictTo('user'),updateReviewValidator,checkValidator,reviewController.updateReview).delete(authController.restrictTo('admin','user'),deleteReviewValidator,checkValidator,reviewController.deletedReview);

module.exports = router;