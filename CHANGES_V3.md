# CHANGES V3 — API Refactor Changelog

All changes align the frontend with the backend contract documented in the
WhatsApp SaaS Production Architecture doc. Every fix is keyed to the issue
number from Section 4 / Section 6 of that document.

---

## Files Changed

### `src/lib/api.ts`
- **[Issue 8]** Default base URL changed from `localhost:5000` → `localhost:4000`
  (backend default port is 4000, not 5000)
- Error parsing updated to match backend error envelope:
  `{ success: false, error: "msg", code: "CODE" }` (reads `error` field, not `message`)

### `src/lib/apiClient.ts`
- Added `v1()` path helper: all service calls are now automatically prefixed
  with `/api/v1`. Services no longer need to hardcode `/api/` or version prefix.
- Handles legacy `/api/contacts` paths and converts them to `/api/v1/contacts`

### `src/services/auth.ts`
- **[Issue 8]** Endpoint paths corrected: `/api/auth/*` → `/api/v1/auth/*`
- **[Issue 1]** `signupUser()`: payload now sends `displayName` (was `name`)
  and `businessName` (was `companyName`). Phone not forwarded (not in backend schema).
- **[Issue 2]** `normalizeUser()`: reads `displayName`/`display_name` (was `name`).
  `companyName` now sourced from `tenant.name` (not a root-level user field).
- Login token extraction: reads `data.accessToken` from backend envelope
  (was `token` or `data.token`)
- Register: automatically calls `/auth/me` if response has no `user` object
  (per architecture doc note on register response)
- Added `refreshToken()` function for token rotation
- Added `AuthUser.role` and `AuthUser.tenantId` fields

### `src/services/authService.ts`
- `RegisterPayload`: added comment clarifying `name` maps to `displayName` in API
- `register()`: phone no longer forwarded to backend
- Endpoint comments updated to `/api/v1/auth/me`

### `src/services/contactsService.ts`
- **[Issue from Section 4]** Response unwrapping: `raw?.contacts` → `raw?.data`
  (backend wraps all responses in `{ success, data }`)
- `list()` now returns `ContactListResult` with `nextCursor` and `hasMore`
  (cursor pagination, not offset)
- `pipelineStats()`: endpoint corrected to `/contacts/stats/pipeline`
  (was `/contacts/stats`). Returns `{ new, contacted, qualified, converted, lost }`
- `update()`: phone field explicitly stripped from payload — backend does not
  allow phone updates (phone is the contact identity key)
- `create()`: `phone` is now the first/required field (matches backend schema)
- `normalize()`: added `notes`, `updated_at`, `last_active` fields

### `src/services/messagesService.ts`
- **[Issue 3 — HARD BREAK]** `forContact()`: URL changed from
  `/contacts/:id/messages` → `/messages/conversation/:contactId`
- **[Issue 4 — HARD BREAK]** `send()` signature changed:
  - Was: `send(contactId, content)`
  - Now: `send({ contactId, whatsappAccountId, content, mediaUrl?, mediaType? })`
  - `whatsappAccountId` is required by backend validation
- `inbox()` now accepts `{ cursor, limit, unreadOnly }` options
- `inbox()` returns `InboxListResult` with cursor pagination
- `markAllRead()`: URL corrected to `/messages/conversation/:contactId/read`
  (was `/contacts/:id/messages/read`)
- `Message` type updated: `direction` field added, `sender`/`timestamp` kept as
  legacy aliases for backward compatibility with existing components

### `src/services/campaignsService.ts`
- **[Issue 6 — HARD BREAK]** `create()`: `recipientContactIds` renamed to
  `contactIds` in API payload
- **[Issue 6]** `create()`: `whatsappAccountId` added as required parameter
- **[Issue 7]** `update()` and `delete()` now present and functional
  (routes exist in backend — were just missing from old service)
- `send()` return type corrected: returns `{ campaignId, status }` not `Campaign`
- `cancel()` added: `POST /campaigns/:id/cancel`
- `normalize()` updated: `sentCount`, `totalRecipients`, `startedAt`, `completedAt`
  mapped from snake_case fields
- Response unwrapping: `raw?.campaign` → `raw?.data`

### `src/services/templatesService.ts`
- **[ENDPOINT FIX]** All paths changed from `/templates` → `/campaigns/templates`
  (templates are mounted under the campaigns router)
- `create()` payload: added `variables` array (required by backend schema)
- `category` type narrowed to `"marketing" | "utility" | "authentication"`
- `status` type updated: lowercase to match backend (`"approved"` not `"Approved"`)
- Removed `imageUrl` (not in backend schema)
- Response unwrapping: `raw?.template` → `raw?.data`

### `src/services/whatsappAccountsService.ts` *(NEW)*
- **[Issue 5 — HARD BREAK]** New service replacing incorrect `/whatsapp` URL
- All endpoints use `/whatsapp-accounts` (correct backend mount point)
- `create()` requires `apiToken` field (backend validates this — was missing before)
- `update()` supports token rotation via `apiToken` field
- `delete()` is a soft-disconnect (sets `status = "disconnected"`)

### `src/services/apiKeysService.ts` *(NEW)*
- Full implementation of `/api-keys` CRUD
- `create()` returns `NewApiKeyResponse` with the raw `key` (shown once only)
- `revoke()` soft-deletes a key

### `src/services/conversations.ts` *(REPLACED)*
- Was calling `/api/conversations` which does not exist in backend
- Now re-exports `messagesService` — use `messagesService.inbox()` and
  `messagesService.forContact()` instead

### `src/services/leads.ts` *(REPLACED)*
- Was calling `/api/leads` which does not exist in backend
- "Leads" = contacts at `new`/`contacted` stage
- Now re-exports `contactsService` — use `contactsService.list({ stage: "new" })`

### `src/services/templates.ts` *(REPLACED)*
- Was calling `/api/templates` with `user_id` field (both wrong)
- Now re-exports `templatesService`

### `.env.example`
- **[Issue 8]** Dev URL note corrected: port 5000 → 4000

---

## Summary of Issues Fixed

| Issue | Severity | Description | Status |
|-------|----------|-------------|--------|
| 1 | 🔴 HARD BREAK | Register field names: `name`/`companyName` → `displayName`/`businessName` | ✅ Fixed |
| 2 | 🟡 SILENT BUG | User name shows blank — reads `name` but backend sends `displayName` | ✅ Fixed |
| 3 | 🔴 HARD BREAK | Messages URL: `/messages/contact/:id` → `/messages/conversation/:id` | ✅ Fixed |
| 4 | 🔴 HARD BREAK | Send message missing `whatsappAccountId` — backend rejects every send | ✅ Fixed |
| 5 | 🔴 HARD BREAK | WhatsApp URL: `/whatsapp` → `/whatsapp-accounts` + `apiToken` required | ✅ Fixed |
| 6 | 🔴 HARD BREAK | Campaign create: `recipientContactIds` → `contactIds` + `whatsappAccountId` added | ✅ Fixed |
| 7 | 🟡 MISSING | Campaign `PUT`/`DELETE` routes — existed in backend, missing from frontend service | ✅ Fixed |
| 8 | 🔴 HARD BREAK | Base URL port: `localhost:5000` → `localhost:4000` | ✅ Fixed |
| — | 🔴 WRONG | `/api/conversations` does not exist — replaced with `/messages/*` | ✅ Fixed |
| — | 🔴 WRONG | `/api/leads` does not exist — replaced with `/contacts` | ✅ Fixed |
| — | 🔴 WRONG | `/api/templates` wrong path — corrected to `/campaigns/templates` | ✅ Fixed |

---

## Required DB Objects (run in Supabase SQL editor)

The following must be created before any backend calls will work end-to-end.
Full SQL is in Section 8 of the architecture doc.

1. `CREATE OR REPLACE VIEW public.inbox_summary` — required by `GET /messages/inbox`
2. `CREATE OR REPLACE VIEW public.contact_pipeline_stats` — required by `GET /contacts/stats/pipeline`
3. Unique constraint on `contact_tags` — required for tag upserts
4. Unique constraint on `campaign_recipients` — required for recipient upserts
5. RPC `increment_campaign_counts` — required by campaign worker
6. RPC `encrypt_api_token` + pgcrypto extension — required by WhatsApp account creation
7. RPC `admin_list_tables` — required by admin panel

---

## Frontend Components to Update

These pages/hooks call the old service methods and need their call sites updated:

- Any component using `messagesService.send(contactId, content)` must be updated to:
  `messagesService.send({ contactId, whatsappAccountId, content })`
  The active WhatsApp account must be loaded first (from `whatsappAccountsService.list()`).

- Any component using `campaignsService.create({ recipientContactIds })` must rename
  to `contactIds` and add `whatsappAccountId`.

- Any component using `contactsService.list()` that reads `result` as an array
  must update to read `result.contacts` (list() now returns `ContactListResult`).

- `WhatsAppSetupPage.tsx` must import `whatsappAccountsService` (new file) instead
  of any old whatsapp service.
