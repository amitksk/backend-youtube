import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";

const connectDB= async ()=> {
    try{
        const connectionIns= await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log("***************************************************************************")
        console.log(`MongoDB Connected...!! DB HOST: ${connectionIns.connection.host}`);
    } 
    catch(error){
        console.log("MONGODB Connection Faild!!", error);
        process.exit(1);
    }
}

export default connectDB;

