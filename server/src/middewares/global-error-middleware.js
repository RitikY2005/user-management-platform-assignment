function GlobalErrorMiddleware(err,req,res,next){
    const errorMessage=err.message || "Server error";
    const statusCode=err.status || 500;

    res.status(500).json({
        success:false,
        message:errorMessage,
        error:errorMessage
    });
}

export default GlobalErrorMiddleware;