import { success } from 'zod';
import asyncHandler from '../middewares/async-handler-middleware.js';
import * as UserService from '../services/user-services.js';

export const getMe=asyncHandler(async (req,res,next)=>{
    const {_id:userId}=req.user;
    
    const {message,user}=await UserService.getMe(userId);

    res.status(200).json({
        success:true,
        message:message,
        user
    });
});

export const updateMe=asyncHandler(async (req,res,next)=>{
   const {_id:userId}=req.user;
   const data=req.validatedData.body; 

   const {message,user}=await UserService.updateMe(userId,data);

   res.status(200).json({
    success:true,
    message,
    user
   })
});