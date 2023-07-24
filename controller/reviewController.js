const catchAsync = require('../midlleware/utils/catchAsync');
const AppError = require('../midlleware/utils/appError');
const Review = require('../models/reviewModel');
exports.createReview = catchAsync(async(request,response,next)=>{
    const review = await Review.create({
        review:request.body.review,
        rating:request.body.rating,
        tour:request.body.tour,
        user:request.user._id
    });
    response.status(201).json({
        status:'success',
        data:{
            review
        }
    })
});

exports.getAllReviews = catchAsync(async(request,response,next)=>{
    const reviews = await Review.find();
    response.status(200).json({
        status:'success',
        data:{
            reviews
        }
    });
});

exports.getReview = catchAsync(async(request,response,next)=>{
    const review = await Review.findById(request.params.id);
    if(!review){
        return next(new AppError('Review not found',404));
    }
    response.status(200).json({
        status:'success',
        data:{
            review
        }
    });
});

exports.updateReview = catchAsync(async(request,response,next)=>{
    const review = await Review.findByIdAndUpdate(request.params.id,request.body,{new:true});
    if(!review){
        return next(new AppError('Review not found',404));
    }
    response.status(200).json({
        status:'success',
        data:{
            review
        }
    })
});

exports.deletedReview = catchAsync(async (request,response,next)=>{
    const review = await Review.findByIdAndDelete(request.params.id);
    if(!review){
        return next(new AppError('Review not found',404));
    }
    response.status(200).json({
        status:'success',
        message:'deleted successfully'
    })
})