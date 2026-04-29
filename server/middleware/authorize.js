export const authorizeMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.userRole) {
      return res.status(403).json({
        success: false,
        message: 'User role not found',
      });
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
    }

    next();
  };
};
