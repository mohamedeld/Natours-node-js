const fs = require('fs');
const mongoose = require('mongoose');
const dotenv= require('dotenv');
const Tour = require('../../models/tourModel');

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

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`,'utf-8'));

const importData = async ()=>{
    try{
        await Tour.create(tours);
        console.log('data successfully added');
    }catch(err){
        console.log(err);
    }
    process.exit();
};

const deleteData = async ()=>{
    try{
        await Tour.deleteMany();
        console.log('data successfully deleted');
    }catch(err){
        console.log(err);
    }
    process.exit();
};

if(process.argv[2] === '---import'){
    importData();
}else if(process.argv[2] === '--delete'){
    deleteData();
}