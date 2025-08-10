// middlewares/errorHandler.js

export default function errorHandler(err, req, res, next) {
    console.error(err.stack); // Log the error stack for debugging
  
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
  
    return res.status(statusCode).json({
      success: false,
      message,
      error: process.env.NODE_ENV === 'production' ? undefined : err.stack
    });
  }
  