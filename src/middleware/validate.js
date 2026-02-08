// Shared input validation helpers

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const VALID_PREFERENCE_TYPES = ['allergy', 'dietary', 'cuisine', 'dislike'];
const VALID_PREFERENCE_SOURCES = ['user_input', 'llm_inferred'];
const VALID_FULFILLMENT_TYPES = ['in_store', 'pickup', 'delivery'];

function isValidEmail(email) {
  return typeof email === 'string' && EMAIL_RE.test(email) && email.length <= 254;
}

function isValidPassword(password) {
  if (typeof password !== 'string' || password.length < 8 || password.length > 128) return false;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasUpper && hasLower && hasNumber;
}

function parsePositiveInt(val) {
  const n = parseInt(val, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function clampRadius(val, defaultVal = 10, max = 100) {
  const n = parseFloat(val);
  if (!Number.isFinite(n) || n <= 0) return defaultVal;
  return Math.min(n, max);
}

function truncate(str, maxLen) {
  if (typeof str !== 'string') return '';
  return str.slice(0, maxLen);
}

module.exports = {
  EMAIL_RE,
  VALID_PREFERENCE_TYPES,
  VALID_PREFERENCE_SOURCES,
  VALID_FULFILLMENT_TYPES,
  isValidEmail,
  isValidPassword,
  parsePositiveInt,
  clampRadius,
  truncate,
};
