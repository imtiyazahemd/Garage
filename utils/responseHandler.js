/**
 * Utility to standardize API responses
 */
exports.successResponse = (res, data, message = '', statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  };
  
  exports.errorResponse = (res, message = 'Error occurred', statusCode = 400) => {
    return res.status(statusCode).json({
      success: false,
      message
    });
  };
  
  exports.notFoundResponse = (res, message = 'Resource not found') => {
    return res.status(404).json({
      success: false,
      message
    });
  };
  
  exports.unauthorizedResponse = (res, message = 'Unauthorized access') => {
    return res.status(401).json({
      success: false,
      message
    });
  };
  
  exports.forbiddenResponse = (res, message = 'Forbidden access') => {
    return res.status(403).json({
      success: false,
      message
    });
  };