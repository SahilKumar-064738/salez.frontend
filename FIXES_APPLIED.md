# Fixes Applied — Salez Frontend

## Fix 1 — Register Flow (Token Not Returned)

**Files changed:**
- `src/services/authService.ts`
- `src/services/auth.ts`
- `src/hooks/use-auth.ts`

**What was done:**
- `authService.register()` now clears any stale token before calling signup, ensuring clean state
- Throws a clear `"Token not generated. Please try logging in."` error if backend returns no token
- `auth.ts / signupUser()` now accepts and forwards `businessType` to backend
- `RegisterPayload` interface extended with `businessType?: string`
- `useSignup` hook now passes `businessType` through to `authService.register()`
- After successful signup, token is stored via `setAuthToken()` and user is set in AuthContext → auto-redirects to `/inbox`

---

## Fix 2 — Inbox Mobile Responsive (WhatsApp-style)

**File changed:** `src/pages/InboxPage.tsx`

**What was done:**
- Introduced `mobileView` state (`"list" | "chat"`) to track which panel is shown on mobile
- On mobile (<md): only ONE panel visible at a time — either contacts list OR chat window
- On desktop (≥md): both panels visible side-by-side (unchanged behaviour)
- `handleSelect(id)` sets `activeId` and switches `mobileView` to `"chat"`
- `handleBack()` switches `mobileView` back to `"list"`
- Added `← Back` button (ArrowLeft icon) in ChatWindow header — `md:hidden` so only on mobile
- Refactored into two sub-components: `<ConversationList>` and `<ChatWindow>` for clarity
- Message bubbles now use `max-w-[80%] sm:max-w-[68%]` for better mobile fit
- Page height uses `100dvh` (dynamic viewport height) to handle mobile browser chrome correctly

---

## Fix 3 — CSV Import Duplicate Contacts

**File changed:** `src/services/contactsService.ts`

Already correctly implemented in the previous version:
- `bulkCreate()` calls `POST /contacts/bulk` with `{ contacts: [...] }` — single request
- Backend is expected to use `INSERT ... ON CONFLICT (phone, user_id) DO UPDATE SET name = EXCLUDED.name`
- Fallback per-contact loop uses `{ upsert: true }` param

**UX messaging fix (already in ContactsPage.tsx):**
- Shows `"✔ X contacts imported or updated"` instead of `"X failed"`
- Result panel shows green success state

---

## Fix 4 — Contacts Not Visible After Import

**Files checked:** `src/lib/api.ts`, `src/services/auth.ts`

- Auth token is always read from `localStorage` key `"auth_token"` via `getAuthToken()`
- `apiFetch()` automatically injects `Authorization: Bearer <token>` on every request
- Backend `GET /contacts` must filter by `user_id` extracted from the JWT — this is a backend responsibility
- Frontend sends the correct token on every API call ✓

---

## Fix 5 — Global Auth (Axios/fetch instance)

**File:** `src/lib/api.ts`

- `VITE_API_URL` env var used as base URL (set to `https://salez-backend.onrender.com` in `.env`)
- All requests go through `apiFetch()` which attaches `Authorization: Bearer <token>` automatically
- `apiClient.ts` wraps `apiFetch` for typed `GET/POST/PUT/PATCH/DELETE` helpers used across all services

---

## Summary of Changed Files

| File | Change |
|------|--------|
| `src/services/authService.ts` | Clear stale token before register; clearer error message; add `businessType` to payload type |
| `src/services/auth.ts` | Accept + forward `businessType` in `signupUser()` |
| `src/hooks/use-auth.ts` | Pass `businessType` through to `authService.register()` |
| `src/pages/InboxPage.tsx` | Full mobile-responsive rewrite with WhatsApp-style panel switching |
