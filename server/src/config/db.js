import { MONGODB_URI } from "../constants/env-variables.js";
import mongoose from "mongoose";

async function connectToDatabase(){
    try{

        const {connection}=await mongoose.connect(MONGODB_URI);
        console.log(`Connected successfully to database ->>> ${connection.host}`);
    } catch(error){
        console.error(`error in connecting to database->>`,error);
        process.exit(1);
    }
}

export default connectToDatabase;