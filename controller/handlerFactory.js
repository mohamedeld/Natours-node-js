const catchAsync =require('../midlleware/utils/catchAsync');
const AppError = require('../midlleware/utils/appError');
const APIFeatures = require("../midlleware/utils/APIFeatures");

exports.deleteOne = Model => catchAsync(async (request, response,next) => {
    const document = await Model.findByIdAndDelete(request.params.id);
    if (!document) {
      return next(new AppError('no tour was found with this id', 404));
    }
    response.status(204).json({
      status: 'success',
      message:"deleted successfully",
      data: null,
  
    });
  });

exports.updateOne = Model => catchAsync(async (request, response,next) => {
    const document = await Model.findByIdAndUpdate(request.params.id, request.body, {
      new: true,
      runValidators: true,
    });
    if (!document) {
      return next(new AppError('no tour was found with this id', 404));
    }
    response.status(200).json({
      status: 'success',
      data: {
        document,
      },
    });
  });


exports.createOne = Model => catchAsync(async (request, response,next) => {
    const document = await Model.create(request.body);
      response.status(201).json({
        status: 'success',
        data: {
          data: document,
        },
      });
  });

exports.getOne = (Model,populateOptions) => catchAsync(async (request, response,next) => {
    let query =  Model.findById(request.params.id);
    if(populateOptions) query = query.populate(populateOptions);
    const document =await query;
    if(!document){
     return next(new AppError('no tour was found with this id', 404));
    }
    response.status(200).json({
      status: 'success',
      data: {
        document,
      },
    });
 });
 
exports.getAll = Model => catchAsync(async (request, response,next) => {
    let filter = {};
    if(request.params.tourId) filter = {tour:request.params.tourId};

    const documentCounts = await Model.countDocuments();
    const feature = new APIFeatures(Model.find(filter), request.query)
      .filter()
      .sort()
      .limitFields()
      .paginate(documentCounts);
    const doc = await feature.mongooseQuery;
    const { mongooseQuery, paginationResult } = feature;
    const document = await feature.mongooseQuery;
    response.status(201).json({
      status: 'success',
      result: document.length,
      paginationResult,
      data: {
        data: doc,
      },
    });
  });