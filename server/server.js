
import express from 'express';
import connectToDatabase from './src/config/db.js';
import { CLIENT_URL,PORT} from './src/constants/env-variables.js';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';



function startServer(){
    try{
        // load the database first 
        connectToDatabase();

        // instiantiate the express app 
        const app=express();

        // global middlewares 
        app.use(cors({
            origin:CLIENT_URL,
            credentials:true,
            methods:["GET","POST","PUT","DELETE","OPTIONS"],
            allowedHeaders:["Content-Type","Authorizaton"]
        }));

        app.use(cookieParser());

        app.use(rateLimit({ // only 40 requests per hour limit per ip
            windowMs:1*60*60*1000,
            limit:40
        }));

        app.use(morgan("dev")); // basic request logging 

        app.use(helmet()); // basic security against attacks like XSS and other stuff 

        // check kserver status 
        app.get('/',(req,res)=>{
            res.status(200).json({
                success:true,
                message:"Servere is running ...."
            })
        })

        // all routes here 

        // run the server at PORT 
        app.listen(PORT,()=>{
            console.log(`Server is running at port: ${PORT}`);
        })

        // global error handler 

    } catch(error){
        console.log(`error is starting the server ->>${error}`);
        process.exit(1);
    }
}

startServer();