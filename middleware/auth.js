const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid or expired' });
  }
};

// Role-based guard — e.g. roleGuard('corporate', 'transporter')
const roleGuard = (...allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ error: `Access denied. Required role: ${allowedRoles.join(' or ')}` });
  }
  next();
};

module.exports = { protect, roleGuard };
