import CustomError from "../utils/custom-error.js";
import UserModel from '../models/user-model.js';
import SessionModel from '../models/session-model.js';
import { REFRESH_TOKEN_EXPIRY } from "../constants/app-constants.js";
import { generateAccessToken, generateRefreshToken, hashToken } from "../utils/token-utils.js";


const registerAsAdmin = async ({ name, email, password }) => {
    // fields already validated usign zod middleware 

    // see if this user already exists 
    const user = await UserModel.findOne({ email });

    if (user) {
        throw new CustomError("User already registered, please login", 429);
    }

    // if user does not exist create one 

    const newUser = new UserModel({
        name,
        email,
        password // auto hash with pre save hook from mongoose
    });

    if (!newUser) {
        throw new CustomError("User creation failed ", 500);
    }


    // make this user admin 
    newUser.role = "ADMIN";
    newUser.createdBy = newUser._id;
    newUser.updatedBy = newUser._id;
    await newUser.save(); // save the user 

    return {
        success: true,
        message: "User created successfuly , proceed to login page"
    }

}

const loginUser = async ({ email, password }) => {
    // fields validated alrady 

    // see if this user even exists 
    const user = await UserModel.findOne({ email }).select("+password");

    if (!user) {
        throw new CustomError("User not found", 404);
    }

    // check if user is active 

    if (user.status !== "ACTIVE") {
        throw new CustomError("Account is not active, call admin", 400);
    }

    // if user exists see if password matches 
    const isPasswordSame = await user.comparePassword(password);
    if (!isPasswordSame) {
        throw new CustomError("Invalid credentials", 400);
    }

    // if both password and email match , then let the user login 
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();

    // save the refreshToken 
    // create will automatically save 
    await SessionModel.create({
        userId: user._id,
        refreshToken: hashToken(refreshToken), // never foreget to hash things 
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY * 24 * 60 * 60 * 1000), // convert to milliseconds 
    });


    return {
        success: true,
        message: "USer logged in successfully",
        refreshToken,
        accessToken
    }

}

const refreshAccessToken = async ({ user, refreshToken }) => {
    if (!refreshToken) {
        throw new CustomError("No refresh token", 500);
    }

    const hashedToken = hashToken(refreshToken);

    const session = await SessionModel.findOne({
        refreshToken: hashed,
        isRevoked: false
    });

    if (!session) {
        throw new CustomError("You are not authenticated , login", 401);
    }

    // if we find the session 
    // check if it is expired 
    if (session.expiresAt < Date.now()) {
        throw new CustomError("Session is expired", 401);
    }

    // revoke the previous one and create a new one 

    session.isRevoked = true;
    await session.save();

    // create a new access token 

    const newAcessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken();

    // save the new refreshToken 
    // create will automatically save 
    await SessionModel.create({
        userId: user._id,
        refreshToken: hashToken(newRefreshToken), // never foreget to hash things 
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY * 24 * 60 * 60 * 1000), // convert to milliseconds 
    });


    return {
        success: true,
        message: "new access token created ",
        newAcessToken,
        newRefreshToken
    }




}

const logoutUser = async (refreshToken) => {

    if (!refreshToken) {
        throw new CustomError("No refresh token", 401);
    }

    await Session.updateOne(
        { refreshTokenHash: hashToken(refreshToken) },
        { isRevoked: true }
    );


    return {
        success:true,
        message:"logged user out"
    }
};




export default {
    registerAsAdmin,
    loginUser,
    refreshAccessToken,
    logoutUser
};