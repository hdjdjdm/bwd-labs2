const errorMiddleware = (err, req, res, next) => {
    console.error(`[ERROR] ${err.name}: ${err.message}`);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Something went wrong ~(>_<。)＼';

    res.status(statusCode).json({ error: message });
};

export default errorMiddleware;
