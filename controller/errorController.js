const AppError = require('../midlleware/utils/appError');

const handleErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const sendErrorForDev = (err, response) => {
  response.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorForProd = (err, response) => {
  if (err.isOperational) {
    response.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    
    console.error('Error ', err);
    response.status(500).json({
      status: 'error',
      message: 'something went wrong',
    });
  }
};

module.exports = (err, request, response, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    let error = { ...err };
    if (error.name === 'CastError') {
      error = handleErrorDB(error);
    }
    sendErrorForDev(err, response);
  } else if (process.env.NODE_ENV === 'production') {
    
    sendErrorForProd(err, response);
  }
};