import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '../constants/env-variables';
import { ACCESS_TOKEN_EXPIRTY } from '../constants/app-constants';
import crypto from 'crypto';

export const generateAccessToken = (user)=>{
    return jwt.sign({_id:user._id,email:user.email,role:user.role},ACCESS_TOKEN_SECRET,{expiresIn:ACCESS_TOKEN_EXPIRTY*60*60});
}

export const hashToken=(token)=>{
    return crypto.createHash("sha256").update(token).digest('hex');
}

export const generateRefreshToken = ()=>{
    // random string , faster lookups than signing by jwt 
    return crypto.randomBytes(64).toString("hex");
}