/**
 * src/services/templates.ts
 *
 * DEPRECATED — This file used /api/templates with user_id which is wrong.
 *
 * The backend mounts templates under /api/v1/campaigns/templates.
 * Use templatesService from "@/services/templatesService" instead.
 *
 * This file re-exports templatesService to avoid breaking existing imports.
 */

export { templatesService } from "@/services/templatesService";
export type { Template } from "@/services/templatesService";

