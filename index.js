
const express = require("express");
const morgan = require("morgan");
const AppError = require("./midlleware/utils/appError");
const globalErrorHandler = require("./controller/errorController");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");

const app = express();
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use("/api/v1/tours",tourRouter);
app.use("/api/v1/users",userRouter);
app.use("/api/v1/auth",authRouter);

app.all("*",(request,response,next)=>{
    next(new AppError(`Cant find ${request.originalUrl} on this server`,404));
});
app.use(globalErrorHandler);
module.exports = app;