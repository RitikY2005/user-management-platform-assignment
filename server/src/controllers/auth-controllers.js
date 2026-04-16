import { REFRESH_TOKEN_EXPIRY } from "../constants/app-constants.js";
import { NODE_ENV } from "../constants/env-variables.js";
import asyncHandler from "../middewares/async-handler-middleware.js";
import * as AuthService from '../services/auth-services.js';

const refreshCookieOptions={
    httpOnly:true,
    sameSite:NODE_ENV==="production"?"none":"lax",
    secure:NODE_ENV==="production",
    maxAge:REFRESH_TOKEN_EXPIRY*24*60*60*1000 // convert in millsec
}

export const registerAdmin=asyncHandler(async (req,res,next)=>{

    const {name,email,password}=req.validatedData.body;

    const {message}=await AuthService.registerAsAdmin({name,email,password});

    res.status(201).json({
        success:true,
        message:message
    });

});

export const loginUser=asyncHandler(async (req,res,next)=>{
    const {email,password}=req.validatedData.body;

    const {message,refreshToken,accessToken}=await AuthService.loginUser({email,password});

    res.cookie("refreshToken",refreshToken,refreshCookieOptions);

    res.status(200).json({
        success:true,
        message:message,
        accessToken
    });

});

export const refreshAccessToken=asyncHandler(async (req,res,next)=>{
    const refreshToken=req.cookies.refreshToken;
    
    const {_id,email,role}=req.user;
    const user={
        _id,
        email,
        role
    };


    const {message,newAccessToken,newRefreshToken}= await AuthService.refreshAccessToken({user,refreshToken});

    res.clearCookie("refreshToken",refreshCookieOptions);

    res.cookie("refreshToken",newRefreshToken,refreshToken);

    res.status(200).json({
        success:true,
        message:message,
        accessToken:newAccessToken
    });
});


export const logoutUser=asyncHandler(async (req,res,next)=>{
    const refreshToken=req.cookies.refreshToken;
    
    const {message}=await AuthService.logoutUser(refreshToken);
    
    res.clearCookie("refreshToken",refreshCookieOptions);

    res.status(200).json({
        success:true,
        message
    })
});

