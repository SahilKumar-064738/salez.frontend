/**
 * src/services/automation.ts
 *
 * Backend contract (all under /api/v1 via apiClient):
 *   GET    /automation        list rules
 *   POST   /automation        create rule
 *   PUT    /automation/:id    update rule
 *   DELETE /automation/:id    delete rule
 *
 * The old /api/rules and /api/reminders endpoints do not exist.
 * Reminders are not a backend resource — use scheduledAt on campaigns instead.
 */

import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/apiClient";

export interface AutomationRule {
  id: number;
  trigger: string;
  condition: any;
  action: any;
  delay_minutes: number;
  created_at?: string;
}

function normalize(r: any): AutomationRule {
  return {
    id: Number(r.id),
    trigger: r.trigger ?? "",
    condition: r.condition ?? {},
    action: r.action ?? {},
    delay_minutes: Number(r.delay_minutes ?? r.delayMinutes ?? 0),
    created_at: r.created_at,
  };
}

export async function fetchRules(): Promise<AutomationRule[]> {
  try {
    const raw = await apiGet<any>("/automation");
    const list = raw?.data ?? raw ?? [];
    return (Array.isArray(list) ? list : []).map(normalize);
  } catch {
    return [];
  }
}

export async function createRule(data: {
  trigger: string;
  condition: any;
  action: any;
  delayMinutes?: number;
}): Promise<AutomationRule> {
  const raw = await apiPost<any>("/automation", data);
  return normalize(raw?.data ?? raw);
}

export async function updateRule(
  id: number,
  data: Partial<{ trigger: string; condition: any; action: any; delayMinutes: number }>
): Promise<AutomationRule> {
  const raw = await apiPut<any>(`/automation/${id}`, data);
  return normalize(raw?.data ?? raw);
}

export async function deleteRule(id: number): Promise<void> {
  await apiDelete(`/automation/${id}`);
}

// ── Reminders ─────────────────────────────────────────────────────────────────
// Reminders are not a backend resource. The backend handles scheduling via
// campaign.scheduledAt. These stubs exist to prevent compile errors.

export async function fetchReminders(): Promise<any[]> {
  console.warn("fetchReminders: /api/reminders does not exist. Use campaign scheduledAt instead.");
  return [];
}

export async function createReminder(_data: {
  leadId: number;
  message: string;
  scheduledAt: string;
  type?: string;
}): Promise<never> {
  throw new Error("createReminder: /api/reminders does not exist. Schedule via campaigns instead.");
}

export async function deleteReminder(_id: number): Promise<void> {
  console.warn("deleteReminder: /api/reminders does not exist.");
}
