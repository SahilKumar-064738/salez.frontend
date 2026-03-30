/**
 * src/services/leads.ts
 *
 * DEPRECATED — This file used /api/leads which does not exist in the backend.
 *
 * The backend does not have a /leads resource.
 * "Leads" are contacts at the "new" or "contacted" stage.
 * Use contactsService from "@/services/contactsService" with a stage filter:
 *
 *   contactsService.list({ stage: "new" })
 *   contactsService.list({ stage: "contacted" })
 *
 * This file re-exports contactsService to avoid breaking existing imports.
 */

export { contactsService as leadsService } from "@/services/contactsService";

