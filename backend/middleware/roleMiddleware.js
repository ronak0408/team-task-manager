// backend/middleware/roleMiddleware.js

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // req.user is set by the 'protect' middleware from Phase 3
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Check if the user's role is in the list of allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. Your role ('${req.user.role}') is not authorized to perform this action.` 
      });
    }

    next(); // Role is authorized, move to the controller
  };
};

module.exports = { authorizeRoles };