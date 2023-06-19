const mongoose = require("mongoose");
const app = require("./index");
const dotEnv = require("dotenv");
dotEnv.config({path:'./config.env'});
const PORT = process.env.PORT || 8000;
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser:true,
    family:4
}).then(()=> {
    app.listen(PORT, () => {
        console.log("listening on port " + PORT);
    });
    console.log("connection successful.")
}).catch(err=> console.log(err));




