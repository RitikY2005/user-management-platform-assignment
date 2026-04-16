import UserModel from '../models/user-model.js';
import CustomError from '../utils/custom-error.js';

export const getMe=async (userId)=>{

    // check if user even exists 
    const user=await UserModel.findById(userId);

    if(!user){
        throw new CustomError("User not found",404);
    }

    return {
        success:true,
        message:"User info",
        user
    };
}

export const updateMe = async (userId,data)=>{
    const allowedFields=["password","name"];

    const updates={};

    for(let key of allowedFields){
        if(data[key]) updates[key]=data[key];
    }

    const user=await UserModel.findById(userId).select("+password");

    if(!user){
        throw new CustomError("User not found",404);
    }

    Object.assign(user,updates);
    await user.save();

    user.password=null;

    return {
        success:true,
        message:"Profile updated successfully",
        user

    }
}