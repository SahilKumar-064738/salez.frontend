# Salez.online v2 — Complete Fix & Redesign Changelog

## 🚨 Bug Fix #1: Login White Screen (Root Cause + Fix)

### Root Cause
Three compounding issues:
1. `AuthContext` initialized `isLoading: true` even when no token existed → every page load was "loading"
2. No `AuthGate` on login/signup routes → logged-in user clicking "Login" saw:
   - wouter navigates to `/auth/login`
   - AuthContext still has `isLoading: true` (running `/auth/me` check)
   - Login component renders inside `PublicLayout` which renders Navbar
   - Navbar checks `isAuthenticated` (false during load) → renders login CTAs
   - But the Login *page itself* had no spinner — just rendered nothing visible while loading resolved
   - Once loading resolved, no re-render triggered → **blank screen persisted**
3. `DashboardRedirect` could fire stale `setLocation` calls creating race conditions

### Fix Applied (3 files)
- **`src/context/AuthContext.tsx`**: `isLoading` now initializes to `!!getToken()`. No token = `false` immediately. Also, `login()` sets `isLoading(false)` explicitly.
- **`src/App.tsx`**: Added `AuthGate` component wrapping all auth routes. Shows spinner while loading, redirects to `/inbox` if already authenticated. Uses `{ replace: true }` on all redirects.
- **`src/components/ProtectedRoute.tsx`**: Better spinner with text, uses `{ replace: true }`.

---

## 🚨 Bug Fix #2: Template Selection Bug

### Root Cause
`IndustryPhone` component in `TemplateLanding.tsx` maintained its own `useState` for `shown`, `typing`, and `idx`. When the parent passed a new `industry` prop (e.g., switching from "Coaching" to "CA"), the component **did not reset its state** because React reuses the existing component instance when the same component renders at the same position.

Result: Clicking "CA template" loaded the CA configs but the phone simulator continued playing the Coaching (or previously loaded industry's) animation.

### Fix Applied
Added `key={industry}` to the `<IndustryPhone>` call in `TemplateLanding.tsx`:
```tsx
// BEFORE (bug):
<IndustryPhone industry={industry} />

// AFTER (fixed):
<IndustryPhone key={industry} industry={industry} />
```
The `key` prop forces React to fully unmount and remount the component whenever `industry` changes, resetting all state.

---

## 🔌 API Integration (#3)

### New Files Added

| File | Purpose |
|---|---|
| `src/lib/apiClient.ts` | Axios instance with interceptors. Auto-attaches `Authorization: Bearer <token>`. Global 401 handler clears token + redirects to login. Correct base URL for dev/prod. |
| `src/services/authService.ts` | POST /auth/login, POST /auth/register, GET /auth/me, PUT /auth/change-password |
| `src/services/contactsService.ts` | Full CRUD + stats + tags |
| `src/services/messagesService.ts` | Inbox, contact messages, send, mark read |
| `src/services/templatesService.ts` | CRUD templates |
| `src/services/campaignsService.ts` | Create, send, delete campaigns |

### API Base URL Logic
```
Dev:  VITE_API_URL not set → Vite proxy → /api/v1/* → localhost:5000/api/v1/*
Prod: VITE_API_URL=https://api.salez.online → https://api.salez.online/api/v1/*
```

### 401 Handling
Axios response interceptor automatically:
1. Clears localStorage token
2. Redirects to `/auth/login` (with `replace` to avoid back-button loops)

### Updated Hooks
All existing hooks now delegate to new service layer:
- `use-templates.ts` → `templatesService`
- `use-broadcast.ts` → `campaignsService`
- `use-contacts.ts` → `contactsService`
- `use-auth.ts` → `authService`

---

## 🎨 UI/UX Redesign

### Landing Page (`src/pages/public/Landing.tsx`)
- **Removed**: "10,000+ businesses", fake testimonials, fake stats, "14-day free trial", "No credit card required"
- **Added**: Realistic stat strip (3-5 hrs saved, <1 min response, 20-40% conversions, 24/7 availability)
- **Added**: Problem section, Value Props with real numbers, Features grid (6 cards)
- **Added**: Industry Templates section (4 cards incl. CA/Accounting)
- **Added**: Pricing teaser with ₹4000 → ₹1999 strike-through
- **Added**: Interactive FAQ accordion (5 questions)
- **Added**: Strong dual-CTA final section

### Pricing Page (`src/pages/public/Pricing.tsx`)
- **Removed**: ₹999 Starter plan (as requested)
- **New Plans**: Starter (₹1,999) + Pro (₹3,999) only
- **Added**: Annual billing toggle (20% saving)
- **Added**: 50% OFF badge on Starter (₹4000 → ₹1999)
- **Added**: Full comparison table
- CTAs: "Start Automating WhatsApp" / "Get More Leads Instantly"

### Navbar (`src/components/Navbar.tsx`)
- Added CA/Accounting, E-Commerce, Real Estate to templates dropdown
- CTA changed from "Start Free Trial" → "Start Automating →"

### New Component: `DateRangePicker`
```tsx
// Single date
<DateRangePicker mode="single" value={date} onChange={setDate} />

// Date range (default)
<DateRangePicker value={range} onChange={setRange} />
```

### Template Landing (`src/pages/public/TemplateLanding.tsx`)
- **Fixed**: Template selection bug (key prop)
- **Added**: E-Commerce industry (sequences + configs + templates)
- **Added**: Real Estate industry
- **Added**: CA/Accounting industry (tax reminders, document requests, GST alerts, appointment booking)

---

## 📂 New Folder Structure

```
src/
├── lib/
│   ├── api.ts              (legacy shim — keeps existing code working)
│   ├── apiClient.ts        ⭐ NEW — Axios instance + interceptors
│   └── queryClient.ts
├── services/
│   ├── auth.ts             (legacy shim)
│   ├── authService.ts      ⭐ NEW
│   ├── contactsService.ts  ⭐ NEW
│   ├── messagesService.ts  ⭐ NEW
│   ├── templatesService.ts ⭐ NEW
│   └── campaignsService.ts ⭐ NEW
├── components/
│   └── DateRangePicker.tsx ⭐ NEW
└── context/
    └── AuthContext.tsx     ✅ FIXED
```

---

## ⚙️ Setup

```bash
npm install        # installs axios (newly added dependency)
cp .env.example .env
# Edit .env — set VITE_API_URL for production
npm run dev
```
