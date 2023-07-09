const fs = require('fs');
const Tour = require('./../models/tourModel');
const APIFeatures = require("./../midlleware/utils/APIFeatures");
const catchAsync = require("../midlleware/utils/catchAsync");
const AppError = require('../midlleware/utils/appError');

exports.aliasTopTours = (request,response,next)=>{
    request.query.limit = '5';
    request.query.sort = '-ratingsAverage,price';
    request.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
}


exports.getTours = catchAsync(async (request, response,next) => {
  const documentCounts = await Tour.countDocuments();
  const feature = new APIFeatures(Tour.find(), request.query)
    .filter()
    .sort()
    .limitFields()
    .paginate(documentCounts);
  const allTours = await feature.mongooseQuery;
  const { mongooseQuery, paginationResult } = feature;
  const document = await feature.mongooseQuery;
  response.status(201).json({
    status: 'success',
    result: document.length,
    paginationResult,
    data: {
      tours: allTours,
    },
  });
});
exports.getTour = catchAsync(async (request, response,next) => {
   const tour = await Tour.findById(request.params.id);
   if(!tour){
    return next(new AppError('no tour was found with this id', 404));
   }
   response.status(200).json({
     status: 'success',
     data: {
       tour,
     },
   });
});

exports.getTourStat = catchAsync(async(request,response,next)=>{
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: null,
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
  ]);
  response.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
})


exports.createTour = catchAsync(async (request, response,next) => {
  const newTour = await Tour.create(request.body);
    response.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
});
exports.updateTour = catchAsync(async (request, response) => {
  const tour = await Tour.findByIdAndUpdate(request.params.id, request.body, {
    new: true,
    runValidators: true,
  });
  if (!tour) {
    return next(new AppError('no tour was found with this id', 404));
  }
  response.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.deleteTour = catchAsync(async (request, response,next) => {
  const tour = await Tour.findByIdAndDelete(request.params.id);
  if (!tour) {
    return next(new AppError('no tour was found with this id', 404));
  }
  response.status(204).json({
    status: 'success',
    data: null,
  });
});


exports.getMonthlyPlan = catchAsync(async (request,response,next)=>{
  const year = request.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numOfTours: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { numOfTours: -1 },
    },
  ]);
  response.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
  
})