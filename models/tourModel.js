const mongoose = require("mongoose");
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tour must have a name'],
    unique: true,
  },
  durations: {
    type: Number,
    required: [true, 'A tour must have a duration'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
  },
  price: {
    type: Number,
    required: [true, 'Tour must have a price'],
  },
  summary: {
    type: String,
    required: [true, 'Tour must have a summary'],
  },
  description: {
    type: String,
    required: [true, 'Tour must have a description'],
  },
  imageCover: {
    type: String,
    required: [true, 'Tour must have an image'],
  },
  images:{
    type:[String],
    required: [true, 'Tour must have an images'],
  },
  startDates:{
    type:[Date],
    required: [true, 'Tour must have a start dates'],
  }
});
const Tour = mongoose.model('Tour',tourSchema);

module.exports = Tour;