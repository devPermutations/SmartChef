# SmartChef Security Audit Report

> **Date**: 2026-02-08
> **Auditor**: Claude Code (static analysis + code review)
> **Commit**: `6bb5894` on `master`
> **Scope**: Full-stack review of all backend routes, services, middleware, database, and frontend SPA
>
> **Wave 1 COMPLETED** (2026-02-08): C1 (JWT hardening), C2 (CORS lockdown), C3 (rate limiting), H8 (helmet security headers), M1 (body size limit), M5 (stack trace suppression in prod). Also installed `helmet` and `express-rate-limit`, generated cryptographic JWT secret, added `ALLOWED_ORIGINS` env var.
>
> **Wave 2 COMPLETED** (2026-02-08): H1 (XSS chat fix), H2 (XSS filter fix), H3 (chat history validation), H4+H7 (account lockout), H5 (preference type whitelist), H6 (input length limits), H10 (email validation), H11 (password policy 8+ chars), C5 (2h token expiry), C6 (password change endpoint), M2 (fulfillment whitelist), M3 (ID validation), M4 (demo recipe cache), M7 (JSON.parse safety), M8 (rating validation), M9 (radius clamping), L2 (removed uuid), L4 (bcrypt 12 rounds). Added OTP login verification, failed_logins table, otp_codes table, validation utility module.
>
> **Wave 3 COMPLETED** (2026-02-08): H9 (HttpOnly cookie auth — token no longer in localStorage or JSON responses, SameSite=Strict, Secure in prod, OTP purpose tokens rejected for API auth, logout clears cookie server-side). L1 (Tailwind CSS built locally with `npm run build:css`, CDN removed, CSP tightened to remove cdn.tailwindcss.com and unsafe-inline for scripts). L3 (structured JSON audit logging to `logs/audit.log` — tracks register, login success/fail, lockout, OTP sent/verified/failed/expired, password change). Email transport (nodemailer with configurable SMTP, console fallback for dev).

---

## Executive Summary

SmartChef has a solid foundation with parameterized SQL queries (no SQL injection) and basic XSS prevention (`escHtml()`). However, it is **not production-ready** in its current state. There are **7 critical**, **11 high**, **9 medium**, and **5 low** severity findings that must be addressed before going online.

The most dangerous issues are: open CORS policy, weak/hardcoded JWT secret, zero rate limiting, XSS via LLM chat responses, and missing security headers.

---

## Severity Legend

| Level | Meaning |
|-------|---------|
| **CRITICAL** | Exploitable now, leads to full account compromise or data breach |
| **HIGH** | Significant risk, exploitable with moderate effort |
| **MEDIUM** | Defense-in-depth gap, exploitable under certain conditions |
| **LOW** | Best practice violation, minimal direct risk |

---

## CRITICAL Findings

### C1. JWT Secret Has Hardcoded Fallback
**File**: `src/middleware/auth.js:3`
```js
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
```
**Risk**: If `JWT_SECRET` env var is missing (misconfigured deploy, missing `.env`), any attacker who knows the fallback string can forge valid JWTs for any user ID. The current `.env` value `change-me-to-a-secure-random-string` is also effectively guessable.
**Fix**: Refuse to start the server if `JWT_SECRET` is not set. Generate a cryptographically random secret (256-bit minimum).

---

### C2. CORS Wide Open
**File**: `src/server.js:12`
```js
app.use(cors());
```
**Risk**: Any website on the internet can make authenticated API requests on behalf of logged-in users. An attacker hosts a malicious page, user visits it, and the attacker's JavaScript calls SmartChef APIs with the user's token (obtainable via XSS since token is in localStorage).
**Fix**: Restrict CORS to your actual domain(s): `cors({ origin: 'https://yourdomain.com' })`.

---

### C3. No Rate Limiting on Any Endpoint
**File**: All routes
**Risk**: Multiple attack vectors:
- **Login brute force**: Unlimited password guessing at `/api/auth/login`
- **Registration spam**: Mass account creation at `/api/auth/register`
- **LLM API abuse**: Each `/api/chat` call costs real money (OpenAI/Anthropic API fees)
- **DoS**: Any endpoint can be hammered without restriction
**Fix**: Add `express-rate-limit` with aggressive limits on auth endpoints (5-10 attempts per 15min) and moderate limits globally.

---

### C4. No HTTPS Enforcement
**File**: `src/server.js:44`
**Risk**: Server listens on plain HTTP. Passwords, JWT tokens, and all user data transmitted in cleartext. Vulnerable to MITM attacks, credential sniffing, and session hijacking on any shared network.
**Fix**: In production, enforce HTTPS via reverse proxy (nginx/Cloudflare) or add HSTS header. Redirect HTTP to HTTPS.

---

### C5. No Token Revocation Mechanism
**File**: `src/middleware/auth.js`
**Risk**: JWTs are valid for 7 days with no server-side revocation. If a token is stolen (via XSS, network sniffing, shared computer), it cannot be invalidated. "Logout" only removes the token from localStorage client-side -- the token remains valid.
**Fix**: Implement a token blacklist table (revoked_tokens) or switch to shorter-lived tokens (15-30min) with refresh tokens. Check blacklist in `authMiddleware`.

---

### C6. No Authentication on Password Change / Account Deletion
**File**: `src/routes/auth.js`
**Risk**: There is no password change endpoint at all. Users cannot change their password if compromised. There is also no account deletion endpoint (GDPR compliance issue). The PUT /profile endpoint allows modifying user data without re-authentication.
**Fix**: Add password change endpoint requiring current password verification. Add account deletion. Consider re-authentication for sensitive operations.

---

### C7. LLM API Key Exposed to Server Process Without Scoping
**File**: `src/services/llmService.js:20-21, 38-39`
**Risk**: The LLM API key in `.env` has no scope restrictions documented. If the key has broad permissions (billing, model access beyond chat), a server compromise exposes it all. The key is sent in every LLM request with no request-level budget controls.
**Fix**: Use API keys with minimal permissions. Set spending limits on your OpenAI/Anthropic account. Add a per-user daily chat limit.

---

## HIGH Findings

### H1. XSS via Chat LLM Response
**File**: `public/js/app.js:654, 673-679`
```js
// Chat response rendered as HTML via formatMarkdown():
<div class="text-sm prose prose-sm">${formatMarkdown(result.response)}</div>

// formatMarkdown does NOT sanitize:
function formatMarkdown(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
}
```
**Risk**: LLM responses are inserted as raw HTML. If the LLM is tricked (prompt injection) into returning `<img src=x onerror=alert(document.cookie)>`, it executes in the user's browser. The demo mode also echoes user input back in `[MEMORY: ...]` markers that go through this pipeline.
**Attack**: User sends crafted message -> demo mode echoes it -> formatMarkdown renders it as HTML -> XSS.
**Fix**: Run `escHtml()` on the response BEFORE `formatMarkdown()`, or use a sanitization library like DOMPurify.

---

### H2. XSS in Filter Population
**File**: `public/js/app.js:129-137`
```js
(metadata.cuisines || []).forEach(c => {
  cuisineSelect.innerHTML += `<option value="${c}">${c}</option>`;
});
```
**Risk**: Cuisine names and dietary tags from the database are injected into HTML without escaping. A malicious recipe with `origin = '"><script>alert(1)</script>'` would execute JavaScript. While the data comes from a seed file you control, if any admin/import feature is added later, this becomes exploitable.
**Fix**: Use `escHtml(c)` for both the value attribute and text content, or use `document.createElement('option')` with `.textContent`.

---

### H3. Client Controls Chat History (Prompt Injection Vector)
**File**: `src/routes/chat.js:9`, `src/services/llmService.js:276-278`
```js
const { message, history } = req.body;
// ...
const messages = [
  { role: 'system', content: systemPrompt },
  ...conversationHistory.slice(-10),  // Attacker-controlled
  { role: 'user', content: userMessage }
];
```
**Risk**: The client sends the entire conversation history. An attacker can inject fake "assistant" messages to manipulate the LLM's behavior, bypass safety guardrails, or extract the system prompt. They can craft a history that causes the LLM to reveal user data from the system prompt.
**Fix**: Store conversation history server-side (keyed by user + session), or validate/sanitize the history array (only allow role: 'user' and 'assistant', strip anything suspicious).

---

### H4. User Enumeration via Registration
**File**: `src/routes/auth.js:22-23`
```js
if (existing) {
  return res.status(409).json({ error: 'Email already registered' });
}
```
**Risk**: Attackers can probe the registration endpoint to determine which email addresses have accounts. Combined with no rate limiting (C3), this enables rapid enumeration.
**Fix**: Return a generic message for both cases: "If this email is not already registered, an account has been created." Or keep the current UX but add rate limiting.

---

### H5. No Input Validation on Preference Type
**File**: `src/routes/preferences.js:15-21`
```js
const { type, value, source } = req.body;
// type is stored directly with no validation
const result = memoryService.addPreference(req.userId, type, value, source || 'user_input');
```
**Risk**: `type` should be one of `allergy`, `dietary`, `cuisine`, `dislike` but accepts any string. `source` accepts any string too. This can break the UI, pollute the database, or be used for stored XSS if preference values are rendered unsafely.
**Fix**: Whitelist `type` to allowed values. Validate `source`. Add length limits on `value`.

---

### H6. No Input Length Validation Anywhere
**File**: All routes accepting user input
**Risk**: No length limits on: `name` (auth), `email`, `memory_text` (preferences), `preference_value`, `message` (chat), `location_address`, `fulfillment_type`. Users can submit megabytes of data per field, causing database bloat and potential DoS.
**Fix**: Add reasonable length limits: name (100 chars), email (254 chars), memory_text (1000 chars), preference_value (200 chars), chat message (5000 chars).

---

### H7. No Account Lockout After Failed Logins
**File**: `src/routes/auth.js:37-62`
**Risk**: Combined with no rate limiting, allows unlimited password guessing. A 6-character password with no complexity requirements (C-adjacent) can be brute-forced.
**Fix**: Track failed login attempts per email. Lock account after 5-10 failures for 15-30 minutes. Alternatively, rely on rate limiting (C3 fix) as first line.

---

### H8. Missing Security Headers
**File**: `src/server.js`
**Risk**: No security headers are set:
- **No Content-Security-Policy (CSP)**: No protection against XSS, no restriction on script sources
- **No X-Content-Type-Options**: MIME sniffing attacks possible
- **No X-Frame-Options**: Clickjacking attacks possible (app can be embedded in iframes)
- **No Strict-Transport-Security (HSTS)**: Even with HTTPS, no browser enforcement
- **No Referrer-Policy**: Tokens/sensitive URLs could leak in referrer headers
**Fix**: Add `helmet` middleware which sets all of these by default.

---

### H9. Token Stored in localStorage (XSS = Full Compromise)
**File**: `public/js/app.js:59, 80`
```js
localStorage.setItem('smartchef_token', token);
```
**Risk**: localStorage is accessible to any JavaScript on the page. If ANY XSS vulnerability exists (H1, H2), the attacker gets the JWT and has full account access for 7 days.
**Fix**: Store tokens in HttpOnly cookies (not accessible to JavaScript). Use `SameSite=Strict` and `Secure` flags.

---

### H10. Email Format Not Validated
**File**: `src/routes/auth.js:10-13`
**Risk**: Registration accepts any truthy string as an email. Users can register with `email = "x"` or `email = "<script>..."`. While this doesn't directly cause issues with current code, it breaks any future email-based features (password reset, OTP).
**Fix**: Validate email format with a regex or library like `validator.js`.

---

### H11. Password Policy Too Weak
**File**: `src/routes/auth.js:15-17`
```js
if (password.length < 6) {
  return res.status(400).json({ error: 'Password must be at least 6 characters' });
}
```
**Risk**: 6 characters with no complexity requirements allows extremely weak passwords like `aaaaaa` or `123456`. With no rate limiting and no lockout, these are trivially cracked.
**Fix**: Minimum 8 characters, require at least one uppercase, one lowercase, one number. Consider checking against a common password list (top 10k).

---

## MEDIUM Findings

### M1. No Request Body Size Limit
**File**: `src/server.js:13`
```js
app.use(express.json());
```
**Risk**: Express default is 100KB which is reasonable, but not explicit. The chat endpoint accepts a `history` array that could contain many large messages. An attacker could send repeated large payloads.
**Fix**: Set explicit limit: `express.json({ limit: '100kb' })`. Consider a smaller limit for chat.

---

### M2. `fulfillment_type` Not Validated
**File**: `src/routes/recipes.js:81,90`
```js
const { fulfillment_type } = req.body;
// Stored directly:
.run(req.userId, recipeId, fulfillment_type || 'in_store');
```
**Risk**: Any arbitrary string stored in database. Could be used for stored XSS if rendered without escaping in a future admin view.
**Fix**: Whitelist to `['in_store', 'pickup', 'delivery']`.

---

### M3. Integer Parameter Parsing Not Validated
**File**: Multiple routes (`recipes.js:69`, `stores.js:24,34`, `shopping.js:10,28`)
```js
const recipe = recipeService.getRecipeById(parseInt(req.params.id));
```
**Risk**: `parseInt('abc')` returns `NaN`, `parseInt('1; DROP TABLE')` returns `1`. While SQLite parameterized queries prevent injection, `NaN` is passed to queries which wastes resources and could cause unexpected behavior.
**Fix**: Validate that `parseInt()` result is a positive integer, return 400 otherwise.

---

### M4. Demo Mode Loads All Recipes Per Chat Request
**File**: `src/services/llmService.js:69`
```js
const allRecipes = recipeService.getAllRecipes();
```
**Risk**: Every chat message in demo mode loads all 1000 recipes from SQLite and assembles them (with ingredients + dietary joins each). This is ~3000+ SQL queries per chat message. With multiple concurrent users, this causes severe performance degradation / DoS.
**Fix**: Cache recipes or use a lighter query. Limit to random subset.

---

### M5. Error Stack Traces Logged
**File**: `src/server.js:39-40`
```js
console.error('Error:', err.message);
console.error(err.stack);
```
**Risk**: While the client gets a generic error (good), stack traces in server logs may expose file paths, library versions, and internal structure in hosting provider log dashboards.
**Fix**: Use a proper logger (winston/pino) with log levels. Only log stacks in development mode.

---

### M6. No CSRF Protection
**File**: Entire application
**Risk**: While JWT in Authorization header provides natural CSRF resistance (browsers don't auto-send it), if you switch to cookie-based auth (recommended in H9), CSRF becomes a concern. Also, if an attacker obtains the token via XSS, they can make any request.
**Fix**: If switching to cookies, add CSRF tokens. Consider `SameSite=Strict` cookie attribute.

---

### M7. JSON.parse Without Try/Catch
**File**: `src/services/recipeService.js:23`
```js
instructions: JSON.parse(row.instructions || '[]'),
```
**Risk**: If the `instructions` column contains invalid JSON, this throws an unhandled exception. Express 5 will catch it and return 500, but it's ungraceful and could be used to probe for errors.
**Fix**: Wrap in try/catch with a fallback to `[]`.

---

### M8. `rating` Validation Incomplete
**File**: `src/routes/recipes.js:54`
```js
if (!rating || rating < 1 || rating > 5) {
```
**Risk**: `rating` is not checked to be an integer. `rating = 3.7` or `rating = "3"` would be accepted. Non-numeric strings that are truthy pass the check but fail the comparison, allowing `null`-equivalent values.
**Fix**: `const r = parseInt(rating); if (!Number.isInteger(r) || r < 1 || r > 5)`.

---

### M9. `search_radius_km` Not Bounded
**File**: `src/routes/stores.js:17`, `src/routes/auth.js:94`
**Risk**: User can set `search_radius_km` to `999999` which would return all stores globally. The `radius` query parameter in stores/nearby is also unbounded. This causes unnecessary computation.
**Fix**: Cap radius to a reasonable maximum (e.g., 100km). Validate in both profile update and query parameter.

---

## LOW Findings

### L1. Tailwind CSS from CDN Without SRI
**File**: `public/index.html:8`
```html
<script src="https://cdn.tailwindcss.com"></script>
```
**Risk**: No Subresource Integrity (SRI) hash. If the CDN is compromised, malicious JavaScript is loaded on every page. The Tailwind CDN version is also intended for development only, not production.
**Fix**: Build Tailwind locally or use a production CSS build. If using CDN, add SRI hash.

---

### L2. Unused `uuid` Dependency
**File**: `package.json:23`
**Risk**: Extra dependency increases attack surface. If a vulnerability is found in `uuid`, your app is unnecessarily exposed.
**Fix**: Remove from `package.json` if not used.

---

### L3. No Audit Logging
**File**: Entire application
**Risk**: No logging of security-relevant events: successful/failed logins, password changes, preference modifications, admin actions. Makes incident response and forensics impossible.
**Fix**: Log auth events to a structured log file with timestamps, IPs, and user IDs.

---

### L4. bcryptjs Salt Rounds on Lower End
**File**: `src/routes/auth.js:25`
```js
const passwordHash = bcrypt.hashSync(password, 10);
```
**Risk**: 10 rounds is the historical minimum. With modern hardware (2026), 12 rounds is recommended by OWASP.
**Fix**: Increase to `bcrypt.hashSync(password, 12)`.

---

### L5. `addStore` and `addDeal` Functions Exist But Have No Route
**File**: `src/services/storeService.js:53-78`
**Risk**: These functions exist in the service layer but aren't exposed via any route. If routes are added later without auth, anyone could add stores/deals. Not currently exploitable but worth noting.
**Fix**: Ensure any future routes using these require admin authentication.

---

## Requested Feature: One-Time Code (OTP) for Auth Hardening

The user has requested adding OTP support. Recommended implementation:

### Option A: Email OTP on Login (Recommended)
1. Add `otp_codes` table: `(id, user_id, code, expires_at, used)`
2. After successful password check, generate 6-digit code, store in DB, "send" via email (or display for dev)
3. Return `{ requires_otp: true, otp_session: <temp_token> }` instead of the JWT
4. New endpoint `POST /api/auth/verify-otp` accepts the code + temp token, returns the real JWT
5. Codes expire after 5 minutes, limited to 3 attempts

### Option B: TOTP (Authenticator App)
- More secure but requires QR code setup flow
- Uses `otplib` or `speakeasy` package
- Better UX for frequent logins

### Option C: Magic Link (Email-Only Auth)
- No password at all -- email a login link with a one-time token
- Simplest UX but requires working email delivery

**Recommendation**: Start with **Option A** (email OTP) as it adds a second factor to existing password auth with minimal UX disruption. Can upgrade to TOTP later.

---

## Priority Fix Order

| Priority | ID | Fix |
|----------|----|-----|
| 1 | C1 | Require strong JWT_SECRET, fail on startup if missing |
| 2 | C2 | Lock down CORS to specific origins |
| 3 | C3 | Add rate limiting (express-rate-limit) |
| 4 | H1 | Sanitize LLM chat output (DOMPurify or escHtml before formatMarkdown) |
| 5 | H8 | Add helmet for security headers |
| 6 | H9 | Move to HttpOnly cookie auth (or accept risk + fix XSS first) |
| 7 | C4 | HTTPS enforcement (deployment config) |
| 8 | C5 | Token revocation / shorter token lifetime |
| 9 | H3 | Server-side chat history |
| 10 | H5, H6 | Input validation (types, lengths, formats) |
| 11 | H10, H11 | Email validation + stronger password policy |
| 12 | C6 | Password change endpoint |
| 13 | OTP | One-time code feature (Option A) |
| 14 | H4, H7 | User enumeration fix + account lockout |
| 15 | H2 | Fix XSS in filter population |
| 16 | M1-M9 | Medium fixes (body limits, param validation, etc.) |
| 17 | L1-L5 | Low-priority cleanup |

---

## What's Already Good

- **Parameterized SQL everywhere** -- no SQL injection vulnerabilities found
- **`escHtml()` used consistently** in most frontend rendering (recipes, stores, shopping)
- **bcryptjs for passwords** -- proper hashing, not plaintext
- **JWT auth pattern** is solid (Bearer token, middleware separation)
- **Foreign keys + cascading deletes** in schema
- **`.env` in .gitignore** -- secrets not committed
- **Ownership checks** on preference/memory deletion (WHERE user_id = ?)
- **Express 5 error catching** -- sync errors handled automatically

---

## Appendix: Files Reviewed

| File | Lines | Purpose |
|------|-------|---------|
| `src/server.js` | 48 | Express setup, middleware, routes |
| `src/middleware/auth.js` | 25 | JWT generation + verification |
| `src/routes/auth.js` | 110 | Register, login, profile |
| `src/routes/recipes.js` | 95 | Recipe search, detail, selection |
| `src/routes/stores.js` | 47 | Store lookup |
| `src/routes/shopping.js` | 44 | Shopping list + optimization |
| `src/routes/preferences.js` | 60 | User preferences + memory |
| `src/routes/chat.js` | 24 | LLM chat endpoint |
| `src/services/recipeService.js` | 118 | Recipe SQL queries |
| `src/services/storeService.js` | 80 | Store/deal queries, haversine |
| `src/services/shoppingService.js` | 170 | Shopping optimization |
| `src/services/memoryService.js` | 91 | Preference/memory CRUD |
| `src/services/llmService.js` | 308 | LLM providers + demo mode |
| `src/db/database.js` | 134 | Schema + initialization |
| `src/db/seed.js` | 165 | Seed data |
| `public/index.html` | 199 | SPA HTML shell |
| `public/js/app.js` | 880 | All frontend logic |
| `package.json` | 24 | Dependencies |
| `.gitignore` | 11 | Ignored files |
| `.env` | 5 | Environment config |
