import dotenv from "dotenv";
dotenv.config(); // load env variables 

function getEnvVariables(key){
    if(!process.env[key]){
        throw new Error(`Environment variable is missing -> ${key}`);
    }

    return process.env[key];
}

export const PORT=getEnvVariables("PORT");
export const NODE_ENV=getEnvVariables("NODE_ENV");
export const CLIENT_URL=getEnvVariables("CLIENT_URL");
export const MONGODB_URI=getEnvVariables("MONGODB_URI");
export const ACCESS_TOKEN_SECRET=getEnvVariables("ACCESS_TOKEN_SECRET");