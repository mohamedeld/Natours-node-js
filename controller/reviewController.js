const catchAsync = require('../midlleware/utils/catchAsync');
const AppError = require('../midlleware/utils/appError');
const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');

exports.setTourUserIds = (request,response,next)=>{
    if(!request.body.tour) request.body.tour = request.params.tourId;
    if(!request.body.user) request.body.user = request.user._id;
    next();
}

exports.createReview = factory.createOne(Review);

exports.getAllReviews = factory.getAll(Review);

exports.getReview = factory.getOne(Review);

exports.updateReview = factory.updateOne(Review);

exports.deletedReview = factory.deleteOne(Review);