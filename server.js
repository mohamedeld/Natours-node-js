const mongoose = require("mongoose");
process.on('uncaughtException', (err) => {
  console.log('unhandler exception shutting down');
  console.log(err.name, err.message);
  process.exit(1);
});
const app = require("./index");
const dotEnv = require("dotenv");
dotEnv.config({path:'./config.env'});
const PORT = process.env.PORT || 8000;
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser:true,
    family:4
}).then(()=> {
    
    console.log("connection successful.")
}).catch(err=> console.log("Error ",err));
const server = app.listen(PORT, () => {
  console.log('listening on port ' + PORT);
});

process.on("unhandledRejection",(err)=>{
    console.log("unhandler rejection shutting down");
    console.log(err.name, err.message);
    server.close(()=>{
        process.exit(1);
    })
});


