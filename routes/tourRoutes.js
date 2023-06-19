const express = require("express");
const tourController = require("./../controller/tourController");
const router = express.Router();


router.route("/first-five").get(tourController.aliasTopTours,tourController.getTours);
router.route("/").get(tourController.getTours).post(tourController.createTour);
router.route("/tour-stats").get(tourController.tourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);
router.route("/:id").get(tourController.getTour).patch(tourController.updateTour).delete(tourController.deleteTour);

module.exports = router;