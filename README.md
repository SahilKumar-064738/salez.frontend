# Salez.online — WhatsApp CRM Frontend

## Quick Start

```bash
npm install
cp .env.example .env
# Set VITE_API_URL to your backend URL
npm run dev
```

## Environment Variables

| Variable      | Default                            | Description            |
|---------------|------------------------------------|------------------------|
| VITE_API_URL  | https://salez-backend.onrender.com | Backend API base URL   |

---

## Architecture

### Auth Flow (Session Persistence)

Token stored in `localStorage` as primary, HTTP-only cookie as secondary (set by backend).

On every app load, `AuthProvider` calls `GET /api/auth/me` with:
- `Authorization: Bearer <token>` header (if localStorage token exists)
- `credentials: "include"` (sends HTTP-only cookie if present)

This means the backend can authenticate via **either** mechanism — whichever it prefers.

**Session persists across:**
- Page refresh ✅
- Browser tab close/reopen ✅
- Navigation to Home page ✅

**Backend requirements for cookie support:**
```js
// server.js
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

// Login route
res.cookie("token", jwt, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});
```

### Routing

| Path                     | Type      | Behaviour |
|--------------------------|-----------|-----------|
| `/`                      | Public    | Always shows Landing page — never redirects |
| `/dashboard`             | Redirect  | → `/inbox` if logged in, → `/auth/login` if not |
| `/auth/login`            | Auth      | Login form (no auto-redirect away) |
| `/auth/signup`           | Auth      | Signup form |
| `/pricing`               | Public    | Pricing page |
| `/about`                 | Public    | About page |
| `/terms`                 | Public    | Terms & Conditions |
| `/meta-verification`     | Public    | Meta verification guide |
| `/templates/clinics`     | Public    | Industry landing page |
| `/templates/coaching`    | Public    | Industry landing page |
| `/templates/salons`      | Public    | Industry landing page |
| `/templates/repairs`     | Industry  | Industry landing page |
| `/templates/restaurants` | Public    | Industry landing page |
| `/inbox`                 | Protected | Dashboard inbox |
| `/contacts`              | Protected | Contacts CRM |
| `/pipeline`              | Protected | Sales pipeline |
| `/automation`            | Protected | Automation rules |
| `/broadcast`             | Protected | Broadcast campaigns |
| `/templates`             | Protected | Template manager |
| `/analytics`             | Protected | Analytics dashboard |
| `/billing`               | Protected | Billing |

### Key Bug Fixes

**Issue 1 — "Home Page" button redirected to /inbox:**
- Root cause: `LandingWithRedirect` component auto-redirected authenticated users from `/` → `/inbox`
- Fix: Removed `LandingWithRedirect`. The `/` route now **always** renders the Landing page without any conditional redirect. Post-login flows go to `/dashboard` instead, which performs the redirect.

**Issue 2 — Session lost on refresh / Home navigation:**
- Root cause: `AuthContext` skipped the `/api/auth/me` call if `localStorage` was empty, but didn't account for HTTP-only cookies. Also, stale tokens weren't revalidated.
- Fix: `AuthProvider` **always** calls `/api/auth/me` on mount (not conditionally), sends both the Bearer token and `credentials: "include"`. Any valid session — cookie or token — restores the user state.

**Issue 3 — Login page bounced authenticated users:**
- Root cause: `Login.tsx` had a `useEffect` that called `setLocation("/inbox")` whenever `isAuthenticated` was true. This meant if a user had a valid token and visited `/auth/login`, they were immediately redirected.
- Fix: Removed the `useEffect` redirect from Login and Signup. Let the user stay on the page they navigated to.
