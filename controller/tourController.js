const fs = require('fs');
const Tour = require('./../models/tourModel');
const APIFeatures = require("./../midlleware/utils/APIFeatures");

exports.aliasTopTours = (request,response,next)=>{
    request.query.limit = '5';
    request.query.sort = '-ratingsAverage,price';
    request.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
}


exports.getTours = async (request, response) => {
  try {
    const feature = new APIFeatures(Tour.find(),request.query).filter().sort().limitFields().paginate();
    const allTours = await feature.mongooseQuery;

    response.status(201).json({
      status: 'success',
      data: {
        tours: allTours,
      },
    });
  } catch (err) {
    response.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
exports.getTour = async (request, response) => {
  try {
    const tour = await Tour.findById(request.params.id);
    response.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    response.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createTour = async (request, response) => {
  try {
    const newTour = await Tour.create(request.body);
    response.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    response.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
exports.updateTour = async (request, response) => {
  try {
    const tour = await Tour.findByIdAndUpdate(request.params.id, request.body, {
      new: true,
      runValidators: true,
    });
    response.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    response.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (request, response) => {
  try {
    await Tour.findByIdAndDelete(request.params.id);
    response.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    response.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.tourStats = async (request,response)=>{
  try{
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: '$difficulty',
          numTours: { $sum: 1 },
          numRating: { $sum: '$ratingsQuantity' },
          avgPrice: { $avg: '$price' },
          avgRating: { $avg: '$ratingsAverage' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
    ]);
    response.status(200).json({
      status:"success",
      data:{
        stats
      }
    })
  }catch(err){
    response.status(404).json({
      status:"fail",
      message:err
    })
  }
}

exports.getMonthlyPlan = async (request,response)=>{
  try {
    const year = request.params.year * 1;
    const plan = await Tour.aggregate([]);
    response.status(200).json({
      status: 'success',
      data: {
        plan,
      },
    });

  } catch (err) {
    response.status(404).json({
      status: 'fail',
      message: err,
    });
  }
}