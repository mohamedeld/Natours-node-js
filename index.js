
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const AppError = require("./midlleware/utils/appError");
const globalErrorHandler = require("./controller/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp({
    whitelist:[
        'durations',
        'ratingsAverage',
        'ratingsQuantity',
        'difficulty',
        'price'
    ]
}))


app.use(express.json({limit:'10kb'}));
app.use(express.static(`${__dirname}/public`));

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

const limiter = rateLimit({
    max:100,
    windowMs:60 * 60 * 1000,
    message:"too many requests for this IP, please try again later"
});

app.use('/api',limiter);
app.use("/api/v1/tours",tourRouter);
app.use("/api/v1/users",userRouter);
app.use("/api/v1/auth",authRouter);
app.use('/api/v1/review',reviewRouter);

app.all("*",(request,response,next)=>{
    next(new AppError(`Cant find ${request.originalUrl} on this server`,404));
});
app.use(globalErrorHandler);
module.exports = app;