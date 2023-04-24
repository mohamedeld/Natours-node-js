const mongoose = require("mongoose");
const app = require("./index");
const dotEnv = require("dotenv");
dotEnv.config({path:'./config.env'});
const DB = process.env.DATABASE.replace("<password>",process.env.DATABASE_PASSWORD);
mongoose.connect(DB,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
}).then(()=> console.log("connection successful."));


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log("listening on port " + PORT);
});

