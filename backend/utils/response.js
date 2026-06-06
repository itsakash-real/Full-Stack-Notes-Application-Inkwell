const success = (res, data = {}, message = "Success", statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...data,
  });
};

const created = (res, data = {}, message = "Created successfully") => {
  return success(res, data, message, 201);
};

const paginated = (res, { items, total, page, limit }) => {
  return res.status(200).json({
    success: true,
    data: items,
    pagination: { total, page, limit, pages: Math.ceil(total / limit) },
  });
};

module.exports = { success, created, paginated };
