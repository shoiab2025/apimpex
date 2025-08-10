// middlewares/responseFormatter.js
export const responseFormatter = (req, res, next) => {
  const oldJson = res.json;
console.log('Response Formatter Middleware Loaded');
  res.json = function (data) {
    // If the data is already formatted (e.g., error handler did it), skip
    if (data && data.success !== undefined && data.message !== undefined && data.data !== undefined) {
      return oldJson.call(this, data);
    }

    const formatted = {
      success: true,
      message: res.message || 'Request successful',
      data: data ?? null
    };

    return oldJson.call(this, formatted);
  };

  next();
};
