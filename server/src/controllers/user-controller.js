import { success } from 'zod';
import asyncHandler from '../middewares/async-handler-middleware.js';
import * as UserService from '../services/user-services.js';
import CustomError from '../utils/custom-error.js';

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


export const getUsers = asyncHandler(async (req, res, next) => {

    const query=req.validatedData.query;
    const data = await UserService.getAllUsers(req.query);

    res.status(200).json({
      ...data
    });
 
});

export const getUser = asyncHandler(async (req, res, next) => {
  
    const {userId} = req.validatedData.params;
    const data = await UserService.getUserById(userId);

    res.status(200).json({
      ...data
    });

});

export const createUser = asyncHandler(async (req, res, next) => {
    
    const data=req.validatedData.body;
    data.createdBy=req.user.id; // created by 

    const response = await UserService.createUser(data);

    res.status(201).json({
     ...response
    });
  
});

export const updateUser =asyncHandler( async (req, res, next) => {
  
    const targetUserId = req.validatedData.params.userId;
    const toBeUpdated=req.validatedData.body;
    const currentUser = req.user;

    // Manager restriction: cannot update admin
    if (currentUser.role === "MANAGER") {
      const targetUser = await UserService.getUserById(targetUserId);

      if (targetUser.role === "ADMIN") {
        return next(new CustomError("Managers cannot update admins",403));
      }
    }

    const user = await UserService.updateUser(
      targetUserId,
      req.body,
      currentUser._id
    );

    res.status(200).json({
      success: true,
      message: "User updated",
      data: user,
    });
  
});

// only make user inactive 
export const deleteUser = asyncHandler(async (req, res, next) => {
    const targetUserId=req.validatedData.params.userId;
    const currentUserId=req.user._id;

    const response = await UserService.deleteUser(
      targetUserId,
      currentUserId
    );

    res.status(200).json({
      ...response
    });
 
});