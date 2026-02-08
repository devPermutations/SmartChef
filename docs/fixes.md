# SmartChef Security Hardening - Fixes Log

## Summary
All 32 findings from `docs/security-audit.md` have been addressed across 3 waves.
Commit: `c32d2b0` (pushed to origin/master).

---

## Wave 1: Infrastructure Hardening

| # | Finding | Fix |
|---|---------|-----|
| C1 | JWT secret fallback to weak default | Removed fallback; requires 32+ char secret in `.env`, exits on startup if missing |
| C2 | CORS accepts all origins | Origin whitelist via `ALLOWED_ORIGINS` env var |
| C3 | No rate limiting | `express-rate-limit`: auth 10/15min, chat 30/15min, global 100/15min |
| H8 | No security headers | Added `helmet` with strict CSP (self-only, no inline scripts) |
| M1 | No body size limit | `express.json({ limit: '100kb' })` |
| M5 | Stack traces in error responses | Suppressed in production (`NODE_ENV=production`) |

**Files changed:** `src/server.js`, `package.json`, `.env`
**Dependencies added:** `helmet`, `express-rate-limit`

---

## Wave 2: Input Validation + Auth Hardening + OTP

| # | Finding | Fix |
|---|---------|-----|
| H1 | XSS in `formatMarkdown()` | `escHtml()` before markdown conversion |
| H2 | XSS in `populateFilters()` | `createElement`/`textContent` instead of `innerHTML` |
| H3 | Chat history injection | Server-side sanitization: role whitelist, 20 msg limit, 5000 char max |
| H4+H7 | No brute-force protection | `failed_logins` table, 5 attempts / 15min lockout |
| H5 | Preference type not validated | Whitelist: allergy, dietary, cuisine, dislike |
| H6 | No input length limits | Truncation across all routes via `validate.js` |
| H10 | No email format validation | Regex + lowercase normalization |
| H11 | Weak password policy | 8+ chars, upper + lower + number required |
| C5 | Token never expires | Reduced from 7d to 2h |
| C6 | No password change | `POST /api/auth/change-password` endpoint |
| M2 | fulfillment_type not validated | Whitelist: in_store, pickup, delivery |
| M3 | ID params not validated | `parsePositiveInt()` on all `:id` routes |
| M4 | Demo recipes loaded every chat | 5min TTL cache in `llmService.js` |
| M7 | JSON.parse unguarded | try/catch with empty array fallback |
| M8 | Rating not validated | Integer 1-5 enforcement |
| M9 | Radius unbounded | `clampRadius()` max 100km |
| L2 | Unused uuid dependency | Removed from `package.json` |
| L4 | Low bcrypt rounds (10) | Increased to 12 |
| OTP | No 2FA | Full OTP system: 6-digit code, 5min expiry, 3 attempts, email delivery |

**Files changed:** `src/routes/auth.js`, `src/routes/recipes.js`, `src/routes/stores.js`, `src/routes/shopping.js`, `src/routes/preferences.js`, `src/routes/chat.js`, `src/middleware/validate.js` (new), `src/db/database.js`, `src/services/recipeService.js`, `src/services/llmService.js`, `public/index.html`, `public/js/app.js`

---

## Wave 3: Cookies + Self-hosted CSS + Logging + Email

| # | Finding | Fix |
|---|---------|-----|
| H9 | Token in localStorage | HttpOnly cookie (`smartchef_token`, SameSite=Strict, Secure in prod) |
| - | OTP token reuse | Purpose-scoped JWTs; `purpose` tokens rejected by auth middleware |
| - | No server-side logout | `POST /api/auth/logout` clears cookie |
| L1 | CDN-loaded Tailwind CSS | Self-hosted build via `@tailwindcss/cli` |
| - | CSP too permissive | Tightened: no CDN scripts/styles, self-only |
| L3 | No audit trail | `auditLog.js`: structured JSON to `logs/audit.log` |
| - | No email transport | `emailService.js` with nodemailer (SMTP or console fallback) |

**Files changed:** `src/middleware/auth.js`, `src/routes/auth.js`, `src/server.js`, `src/services/auditLog.js` (new), `src/services/emailService.js` (new), `public/index.html`, `public/js/app.js`, `public/css/styles.css` (new), `src/input.css` (new), `tailwind.config.js` (new)
**Dependencies added:** `cookie-parser`, `nodemailer`, `tailwindcss`, `@tailwindcss/cli`

---

## Post-Wave Fix: Tailwind v4 Brand Colors

**Problem:** Tailwind v4 ignores `tailwind.config.js` — uses CSS `@theme` directive instead. Brand color classes (`bg-brand-600`, `text-brand-700`, etc.) were missing from compiled CSS, making buttons invisible (white text on white background).

**Fix:** Moved brand color definitions from `tailwind.config.js` to `@theme` block in `src/input.css`, rebuilt CSS.

**File changed:** `src/input.css`

---

## Fixed: Frontend Buttons Not Working

**Symptom:** All buttons (Sign In, Sign Up, recipe cards, filters, etc.) non-functional in browser.
**Root cause:** Helmet's default CSP adds `script-src-attr: 'none'`, which blocks ALL inline event handlers (`onclick`, `oninput`, `onchange`, `onkeydown`). The app uses inline handlers extensively in both static HTML and dynamically generated HTML.
**Fix:** Added `scriptSrcAttr: ["'unsafe-inline'"]` to helmet CSP config in `src/server.js`.
**Verified:** 21/21 Puppeteer E2E tests passing (see `test/e2e.test.js`).

---

## Remaining (Deployment Config)

- [ ] Configure SMTP credentials in `.env` for real OTP email delivery
- [ ] Set `NODE_ENV=production`
- [ ] Set `ALLOWED_ORIGINS` to production domain
- [ ] Serve behind HTTPS reverse proxy (nginx/Cloudflare)
