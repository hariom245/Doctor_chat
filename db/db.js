const mongoose=require('mongoose');
const url="mongodb://0.0.0.0:27017/depression";
const connectMongo=async()=>{
    try {
     await mongoose.connect(url)
     console.log("connected to mongo");
     
    } catch (error) {
     console.log(error)
    }
 }
 module.exports=connectMongo;