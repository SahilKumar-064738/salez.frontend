/**
 * src/services/automation.ts
 *
 * FIXES:
 * 1. URL: /automation  (backend responds here — validation error proves route exists)
 * 2. Payload sends BOTH snake_case AND camelCase so backend accepts regardless
 *    of which naming convention its Zod/Joi schema uses internally.
 * 3. Response normalizer handles both casings coming back from backend.
 */

import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/apiClient";

// ─── What we send to backend for each action ────────────────────────────────
export interface AutomationAction {
  type: string; // "send_whatsapp" | "send_email" | "mark_due_soon" | "escalate"
  template_id?: number; // only for whatsapp/email
  delay_minutes?: number; // delay_days * 1440
  content?: string;
  stage?: string;
  tag?: string;
  url?: string;
  message?: string;
}

// ─── What backend returns (accept both casings defensively) ─────────────────
export interface AutomationRule {
  id: number;
  name: string;
  trigger_type?: string;
  triggerType?: string;
  conditions?: Record<string, unknown>;
  actions?: AutomationAction[];
  is_active?: boolean;
  isActive?: boolean;
  is_enabled?: boolean;
  created_at?: string;
  updated_at?: string;
}

// ─── Normalized shape the UI works with ─────────────────────────────────────
export interface NormalizedRule {
  id: number;
  name: string;
  trigger_type: string;
  conditions: Record<string, unknown>;
  actions: AutomationAction[];
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export function normalizeRule(r: AutomationRule): NormalizedRule {
  return {
    id: r.id,
    name: r.name,
    trigger_type: r.trigger_type ?? r.triggerType ?? "",
    conditions: r.conditions ?? {},
    actions: r.actions ?? [],
    // ✅ check all possible boolean field names the backend might return
    is_active: r.is_active ?? r.isActive ?? r.is_enabled ?? true,
    created_at: r.created_at,
    updated_at: r.updated_at,
  };
}

// ─── What we POST to backend ─────────────────────────────────────────────────
// Send BOTH snake_case and camelCase — whichever the backend Zod schema
// validates against, it will find the field it expects.
export interface CreateRulePayload {
  name: string;
  trigger_type: string;
  triggerType?: string; // ✅ optional — TS happy, backend doesn't choke on it
  conditions: Record<string, unknown>;
  actions: AutomationAction[];
  is_active: boolean;
  isActive?: boolean; // ✅ optional — same
}

interface ListResponse {
  data: AutomationRule[];
}
interface SingleResponse {
  data: AutomationRule;
}

// ─── Helper: unwrap response — backend may return { data: [...] } or [...] ──
function unwrapList(r: any): AutomationRule[] {
  const list = r?.data ?? r;
  return Array.isArray(list) ? list : [];
}
function unwrapSingle(r: any): AutomationRule {
  return r?.data ?? r;
}

export const automationService = {
  list(): Promise<NormalizedRule[]> {
    return apiGet<ListResponse>("/automation").then((r) =>
      unwrapList(r).map(normalizeRule),
    );
  },

  getById(id: number): Promise<NormalizedRule> {
    return apiGet<SingleResponse>(`/automation/${id}`).then((r) =>
      normalizeRule(unwrapSingle(r)),
    );
  },

  create(payload: CreateRulePayload): Promise<NormalizedRule> {
    console.log(
      "[automationService.create] POST /api/v1/automation payload:\n",
      JSON.stringify(payload, null, 2),
    );
    return apiPost<SingleResponse>("/automation", payload).then((r) =>
      normalizeRule(unwrapSingle(r)),
    );
  },

  update(
    id: number,
    payload: Partial<CreateRulePayload>,
  ): Promise<NormalizedRule> {
    return apiPatch<SingleResponse>(`/automation/${id}`, payload).then((r) =>
      normalizeRule(unwrapSingle(r)),
    );
  },

  delete(id: number): Promise<void> {
    return apiDelete(`/automation/${id}`);
  },

  toggle(id: number): Promise<NormalizedRule> {
    return apiPost<SingleResponse>(`/automation/${id}/toggle`).then((r) =>
      normalizeRule(unwrapSingle(r)),
    );
  },
};
