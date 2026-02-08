const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, '..', '..', 'logs');
const LOG_FILE = path.join(LOG_DIR, 'audit.log');

// Ensure logs directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

function log(event, details = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    event,
    ...details,
  };

  const line = JSON.stringify(entry) + '\n';

  // Write to file (append)
  fs.appendFileSync(LOG_FILE, line);

  // Also log to console in non-production for visibility
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[AUDIT] ${event}`, details);
  }
}

// Convenience methods for common events
const audit = {
  loginSuccess: (email, ip) => log('LOGIN_SUCCESS', { email, ip }),
  loginFailed: (email, ip, reason) => log('LOGIN_FAILED', { email, ip, reason }),
  loginLocked: (email, ip) => log('LOGIN_LOCKED', { email, ip }),
  register: (email, ip) => log('REGISTER', { email, ip }),
  otpSent: (email) => log('OTP_SENT', { email }),
  otpVerified: (email) => log('OTP_VERIFIED', { email }),
  otpFailed: (email, attemptsLeft) => log('OTP_FAILED', { email, attemptsLeft }),
  otpExpired: (ip) => log('OTP_EXPIRED', { ip }),
  passwordChanged: (userId, ip) => log('PASSWORD_CHANGED', { userId, ip }),
  logout: (userId) => log('LOGOUT', { userId }),
};

module.exports = audit;
