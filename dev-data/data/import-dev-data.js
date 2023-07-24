
const fs = require('fs');
const mongoose = require('mongoose');
const dotEnv= require('dotenv');

const Tour = require('../../models/tourModel');

dotEnv.config({path:`${__dirname}/config.env`});

if (!process.env.DATABASE_URL) {
    console.error('MongoDB connection string is not defined.');
    process.exit(1);
  }

mongoose.connect(process.env.DATABASE_URL,{
    useNewUrlParser:true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    family:4
}).then(()=> {
    console.log("connection successful.")
}).catch(err=> console.log("Error ",err));


const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`,`utf-8`));

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

if(process.argv[2] === '--import'){
    importData();
}else if(process.argv[2] === '--delete'){
    deleteData();
}