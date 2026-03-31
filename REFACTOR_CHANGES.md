# Salez Frontend — Refactor Changes

## Summary of all changes made in this refactor pass

---

## TASK 1: API Integration Fixes

### `src/lib/apiClient.ts`
- Added `apiPatch` export (PATCH method) — contacts now use PATCH not PUT

### `src/services/contactsService.ts`
- **Fixed endpoint**: `/contacts/pipeline-stats` (was `/contacts/stats/pipeline`)
- **Fixed HTTP method**: `PATCH /contacts/:id` (was `PUT`)
- **Enforced limit ≤ 100**: `Math.min(filters?.limit ?? 50, 100)`
- **Fixed pagination key**: reads `raw.pagination` then `raw.meta` (API uses `pagination`)
- Added `bulkCreate()` helper for CSV batch import

### `src/services/automation.ts`
- **STUBBED** — `/automation` is not in the backend API contract
- Returns empty arrays; mutations throw with clear error message

### `src/hooks/use-contacts.ts`
- Limit capped at 100 for all queries
- Added `useDeleteContact`, `useAddTag`, `useRemoveTag`, `usePipelineStats` exports

### `src/hooks/use-analytics.ts`
- Removed stale `days` parameter from `useAnalyticsSummary` (not in API)
- Added `staleTime: 60_000` to reduce redundant requests

### `src/hooks/use-inbox.ts`
- Added `refetchInterval: 30_000` on conversations (real-time feel)
- Added `refetchInterval: 15_000` on messages
- Fixed `useMarkConversationRead` signature

### `src/hooks/use-pipeline.ts`
- **Fixed endpoint**: uses `pipeline-stats` not `stats/pipeline`
- **Capped limit** at 100 (was 500)

### `src/hooks/use-billing.ts`
- **STUBBED** — `/billing` not in API contract; `enabled: false`

### `src/hooks/use-automation.ts`
- **STUBBED** — `/automation` not in API contract; `enabled: false`

---

## TASK 2: CSV Import Fix

### `src/pages/ContactsPage.tsx`
- New `CSVImportModal` component with **preview before upload**
- Flexible header mapping: `name | Name | full_name | full name`
- Phone: `phone | Phone | mobile | Mobile | phone_number`
- Only extracts `name` and `phone` — all other columns ignored
- Shows preview table (up to 50 rows) before committing
- Progress feedback with created/failed counts and error list

### `src/pages/BroadcastPage.tsx`
- Fixed `handleCSV` to use same flexible header mapping
- Added toast feedback with count

---

## TASK 3: UI/UX Improvements

### Dialog Boxes — `src/components/ui/dialog.tsx`
- Opens from **CENTER** (was sometimes bottom-anchored)
- Smooth **scale + fade** animation (not slide-from-bottom)
- Bigger default: `max-w-lg`, `rounded-2xl`, `shadow-2xl`
- Backdrop blur added to overlay

### Inbox — `src/pages/InboxPage.tsx`
- **Full WhatsApp Web redesign**:
  - Left panel: scrollable contact/conversation list with search, unread badge, avatar
  - Right panel: full chat window with message bubbles
  - Top: contact header with name, phone, stage badge, action buttons
  - Bottom: textarea input with emoji button, send button, keyboard shortcut hint
- Outbound messages: primary color right-aligned with delivery tick
- Inbound messages: card/border left-aligned
- Auto-scroll to latest message
- **Demo fallback**: shows 4 sample conversations + messages when backend returns empty
- Polls every 15s (messages) and 30s (conversations) for real-time feel

### Templates — `src/pages/TemplatesPage.tsx`
- Switched from `Drawer` to centered `Dialog` for editing
- Category field added (utility/marketing/authentication)
- Variable detection from `{{placeholder}}` syntax
- **Demo Mode**: 6 pre-filled industry templates when no real templates exist

### Global CSS — `src/index.css`
- Added dense SaaS styling utilities
- WhatsApp chat background pattern
- Inbox full-height layout fix

---

## TASK 4: Demo System

### `src/pages/AutomationPage.tsx`
- **Complete demo-only redesign** (endpoint doesn't exist)
- Interactive rule toggles (local state)
- Stats row (active rules, total runs, contacts reached)
- Quick-start template gallery
- Clear "Demo Mode" banner explaining status

### `src/pages/BroadcastPage.tsx`
- Demo campaign cards shown when no real campaigns exist

### `src/pages/TemplatesPage.tsx`
- 6 pre-filled demo templates shown when account is empty

### `src/pages/InboxPage.tsx`
- Demo conversations + messages with realistic data

---

## TASK 5: File Export Fix

### `src/pages/ContactsPage.tsx`
- Export now generates **TXT** file (was JSON)
- Format per contact:
  ```
  Name: John Doe
  Phone: +919999999999
  ```
- Downloadable as `contacts-YYYY-MM-DD.txt`

---

## TASK 6: Upgrade Button Fix

### `src/components/AppSidebar.tsx`
- **Removed** Replit redirect link
- **Added** local `UpgradeModal` with 3 pricing tiers (Starter / Growth / Pro)
- Pricing shown in INR (₹999/mo, ₹2,499/mo, ₹5,999/mo)
- "Popular" badge on Growth plan
- Contact email for enterprise

### `src/pages/BillingPage.tsx`
- Replaced with redirect to `/pricing` (local pricing page)

### `src/App.tsx`
- Removed `/billing` route (no API contract for it)
- Kept `/automation` route but now shows demo page

---

## TASK 7: Code Quality

### Removed imports / dead code
- `BillingPage` no longer imported in App.tsx
- Automation + billing hooks are clearly stubbed

### Consistent patterns
- All dialogs use `Dialog` (not `Drawer`) for edit forms
- All services normalize responses with `raw?.data ?? raw`
- Consistent error toast pattern throughout

### API contract strictly followed
- No calls to `/automation` or `/billing`
- All contacts calls use `limit ≤ 100`
- Cursor-based pagination in `contactsService.list()`
- Auth uses `data.accessToken` (not `token`)
- `Authorization: Bearer <token>` header

---

## Files Modified (19 total)

| File | Change |
|---|---|
| `src/App.tsx` | Removed /billing route |
| `src/components/AppSidebar.tsx` | Removed billing nav, fixed upgrade button |
| `src/components/ui/dialog.tsx` | Center animation, bigger size |
| `src/hooks/use-analytics.ts` | Fixed signature, added staleTime |
| `src/hooks/use-automation.ts` | Stubbed |
| `src/hooks/use-billing.ts` | Stubbed |
| `src/hooks/use-contacts.ts` | Limit cap, new exports |
| `src/hooks/use-inbox.ts` | Polling, fixed mark-read |
| `src/hooks/use-pipeline.ts` | Fixed endpoint, cap limit |
| `src/index.css` | Dense SaaS styles |
| `src/lib/apiClient.ts` | Added apiPatch |
| `src/pages/AnalyticsPage.tsx` | Correct endpoints, charts |
| `src/pages/AutomationPage.tsx` | Demo-only redesign |
| `src/pages/BillingPage.tsx` | Redirect to /pricing |
| `src/pages/BroadcastPage.tsx` | CSV fix, demo banner |
| `src/pages/ContactsPage.tsx` | CSV modal, TXT export |
| `src/pages/InboxPage.tsx` | WhatsApp Web layout |
| `src/pages/TemplatesPage.tsx` | Dialog forms, demo templates |
| `src/services/automation.ts` | Stubbed |
| `src/services/contactsService.ts` | PATCH, pipeline-stats, limit |
