const express = require("express");
const tourController = require("../controller/tourController");
const {findTourValidator} = require("../midlleware/Validator/tourValidator");
const checkValidator = require("../midlleware/Validator/checkValidtor");
const authController = require("../controller/authController");
const reviewRouter =require('./reviewRoutes');

const router = express.Router();

router.use('/:tourId/reviews',reviewRouter);
router.use(authController.protect);
router.route("/first-five").get(tourController.aliasTopTours,tourController.getTours);
router
  .route('/')
  .get(checkValidator, tourController.getTours)
  .post(authController.restrictTo('admin'),checkValidator,tourController.createTour);
router.route('/tour-stats').get(checkValidator,tourController.getTourStat);
router
  .route('/monthly-plan/:year')
  .get(checkValidator,tourController.getMonthlyPlan);

router
  .route('/:id')
  .get(
    
    authController.restrictTo('admin', 'lead-guide'),
    findTourValidator,
    checkValidator,
    tourController.getTour
  )
  .patch(
    authController.restrictTo('admin', 'lead-guide'),
   
    checkValidator,
    tourController.updateTour
  )
  .delete(

    authController.restrictTo('admin', 'lead-guide'),
    checkValidator,
    tourController.deleteTour
  );



module.exports = router;