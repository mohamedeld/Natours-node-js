const express = require("express");
const tourController = require("./../controller/tourController");
const {findTourValidator} = require("../midlleware/Validator/tourValidator");
const checkValidator = require("../midlleware/Validator/checkValidtor");
const authController = require("../controller/authController");
const router = express.Router();


router.route("/first-five").get(tourController.aliasTopTours,tourController.getTours);
router
  .route('/')
  .get(authController.protect,checkValidator, tourController.getTours)
  .post( authController.protect,authController.restrictTo('admin'),checkValidator,tourController.createTour);
router.route('/tour-stats').get(checkValidator,tourController.getTourStat);
router
  .route('/monthly-plan/:year')
  .get(checkValidator,tourController.getMonthlyPlan);

router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    findTourValidator,
    checkValidator,
    tourController.getTour
  )
  .patch(
    authController.restrictTo('admin', 'lead-guide'),
    authController.protect,
    checkValidator,
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    checkValidator,
    tourController.deleteTour
  );

module.exports = router;