export const successResponse = (res, statusCode, message) => {
  res.status(statusCode).json({ success: true, message: message });
};

export const errorResponse = (res, statusCode, message) => {
  res.status(statusCode).json({ success: false, error: message });
};
