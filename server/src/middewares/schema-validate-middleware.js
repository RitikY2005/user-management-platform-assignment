import { ZodError } from 'zod';
import CustomError from '../utils/custom-error.js';

function validateSchema(schema) {
    return (req, res, next) => {
        try {

            req.validatedData = schema.parse({
                body: req.body,
                params: req.params,
                query: req.query
            });

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const message = error.issues
                    .map((err) => err.message)
                    .join(", ");
                return next(new CustomError(message, 400));
            }

            return next(error);
        }
    }
}

export default validateSchema;

