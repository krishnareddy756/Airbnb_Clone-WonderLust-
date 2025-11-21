const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || process.env.SECRET || 'change_this_secret';

function signToken(payload, options = {}) {
  const signOpts = { expiresIn: options.expiresIn || '7d' };
  return jwt.sign(payload, SECRET, signOpts);
}

function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (e) {
    return null;
  }
}

// Express middleware to protect routes using Authorization: Bearer <token>
function authenticateJWT(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  const token = auth.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'Invalid or expired token' });
  // attach minimal user info; controllers may still fetch full user from DB if needed
  req.user = payload.user;
  next();
}

module.exports = { signToken, verifyToken, authenticateJWT };
