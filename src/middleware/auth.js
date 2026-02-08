const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  console.error('FATAL: JWT_SECRET must be set in .env and be at least 32 characters.');
  console.error('Generate one with: node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'base64\'))"');
  process.exit(1);
}

function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '2h' });
}

function generateOtpSessionToken(userId) {
  return jwt.sign({ userId, purpose: 'otp' }, JWT_SECRET, { expiresIn: '10m' });
}

function verifyOtpSessionToken(token) {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.purpose !== 'otp') return null;
    return payload;
  } catch {
    return null;
  }
}

const IS_PROD = process.env.NODE_ENV === 'production';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: 'strict',
  maxAge: 2 * 60 * 60 * 1000, // 2 hours, matches token expiry
  path: '/',
};

function setTokenCookie(res, token) {
  res.cookie('smartchef_token', token, COOKIE_OPTIONS);
}

function clearTokenCookie(res) {
  res.clearCookie('smartchef_token', { path: '/' });
}

function authMiddleware(req, res, next) {
  // Read token from HttpOnly cookie (primary) or Authorization header (fallback)
  let token = req.cookies?.smartchef_token;

  if (!token) {
    const header = req.headers.authorization;
    if (header && header.startsWith('Bearer ')) {
      token = header.slice(7);
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.purpose) {
      // Reject OTP session tokens from being used as auth tokens
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { generateToken, generateOtpSessionToken, verifyOtpSessionToken, authMiddleware, setTokenCookie, clearTokenCookie };
