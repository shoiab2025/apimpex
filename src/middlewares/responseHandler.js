// responseHandler.js
export default function responseHandler(req, res, next) {
  res.success = (statusCode = 200, message, data = null) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  };

  res.error = (statusCode = 400, message, error = null) => {
    return res.status(statusCode).json({
      success: false,
      message,
      data: null,
      error,
    });
  };

  next();
}
