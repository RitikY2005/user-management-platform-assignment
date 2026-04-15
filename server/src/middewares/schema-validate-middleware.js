import {ZodError} from 'zod';
import CustomError from '../utils/custom-error';

function validateSchema(schema){
    return (req,res,next)=>{
        try{
            // validate body , params , and queryies 
            req.validatedData=schema.parse({
                body:req.body,
                params:req.params,
                query:req.query
            });
            
            next();
        } catch(error){
            if(error instanceof ZodError){
                next(new CustomError("Invalid Fields",400));
            }

            next(error);  
        }
    }
}

export default validateSchema;

