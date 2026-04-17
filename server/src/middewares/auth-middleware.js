import { ACCESS_TOKEN_SECRET } from '../constants/env-variables.js';
import CustomError from '../utils/custom-error.js';
import jwt from 'jsonwebtoken';

export function restrictRoles(...allowedRoles) {
    return (req, _res, next) => {
        try {
            const user = req.user;
            if (!user || !user.role) {
                return next(new CustomError("User is not authenticated", 401));
            }

            if (!allowedRoles.includes(user.role)) {
                return next(new CustomError("Forbiden, you don't have enough permissions", 403));
            }

            next();
        } catch (error) {
            next(error);
        }
    }
}

export function isAuthenticated(req, res, next) {
    
    const authHeader = req.headers.authorization;

    

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new CustomError("User is not authenticated", 401));
    }

    const accessToken = authHeader.split(" ")[1];
    

    try {
        
        const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
        req.user = decoded;
        
        next();

    } catch (error) {
        return next(new CustomError("Invalid or expired token",401));
    }
}