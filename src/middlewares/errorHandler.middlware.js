
const errorHandler = (err, req, res, next) => {
    console.log(err);
    const status = err.status || 500;

    return res
        .status(status)
        .json({
            success: err.success || false,
            message: err.message || "Something went wrong",
            errors: err.errors || [],
        })
}

export default errorHandler;