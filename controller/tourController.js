const fs = require('fs');
const catchAsync = require("../midlleware/utils/catchAsync");
const AppError = require('../midlleware/utils/appError');
const factory = require('./handlerFactory');
const Tour = require('../models/tourModel');

exports.aliasTopTours = (request,response,next)=>{
    request.query.limit = '5';
    request.query.sort = '-ratingsAverage,price';
    request.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
}


exports.getTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour,{path:'reviews'});
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


exports.createTour = factory.createOne(Tour);

exports.updateTour = factory.updateOne(Tour);

exports.deleteTour = factory.deleteOne(Tour);


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