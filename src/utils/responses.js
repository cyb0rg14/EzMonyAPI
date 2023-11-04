export const successResponse = (res, statusCode, message, data=null) => {
  res.status(statusCode).json({ success: true, message, ...(data && { data }) });
};

export const errorResponse = (res, statusCode, message, data=null) => {
  res.status(statusCode).json({ success: false, message, ...(data && { data }) });
};
