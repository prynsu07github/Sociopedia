const error = (err,req,res,next)=>{
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal server error"
    res.status(statusCode).json({
        success:false,
        message
    })
    next()
}

export default error