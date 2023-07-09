const mongoose = require("mongoose");
const slugify = require("slugify");
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tour must have a name'],
      unique: true,
    },
    slug: String,
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
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message:'Discount price should be less that price'
      },
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
    images: {
      type: [String],
      required: [true, 'Tour must have an images'],
    },
    startDates: {
      type: [Date],
      required: [true, 'Tour must have a start dates'],
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
tourSchema.virtual("durationOfWeeks").get(function () {
  return this.durations / 7;
});
tourSchema.pre("save",function(next){
  this.slug = slugify(this.name,{lower:true});
  next();
});
// tourSchema.pre('find',function(next){
  tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } });
    next();
  });
module.exports  = mongoose.model('Tour',tourSchema);
