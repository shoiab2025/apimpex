// middlewares/filterColumns.js
export function filterColumns(req, res, next) {
  const originalJson = res.json;

  res.json = function (data) {
    const { columns } = req.body;

    if (Array.isArray(columns) && typeof data === 'object' && data !== null) {
      const filterObject = (obj) => {
        return columns.reduce((result, key) => {
          if (key in obj) result[key] = obj[key];
          return result;
        }, {});
      };

      if (Array.isArray(data)) {
        data = data.map(filterObject);
      } else {
        data = filterObject(data);
      }
    }

    return originalJson.call(this, data);
  };

  next();
}
