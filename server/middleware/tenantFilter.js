export const tenantFilterMiddleware = (req, res, next) => {
  // companyId is already attached by authMiddleware
  if (!req.companyId) {
    return res.status(401).json({
      success: false,
      message: 'Company information not found in token',
    });
  }
  next();
};
