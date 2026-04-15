class CustomError extends Error{
    constructor(message="Server Error ",status=500){
        super(message);
        this.status=500;

        Error.captureStackTrace(this,this.constructor);
    }
}

export default CustomError;