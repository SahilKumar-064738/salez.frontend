import { apiUrl } from "@/lib/api";

// ─── Rules ──────────────────────────────────────────────────────────────────
export async function fetchRules() {
  const res = await fetch(apiUrl("/api/rules"), { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch rules");
  return res.json();
}

export async function createRule(data: { userId: number; delayHours: number; templateId: number; order: number }) {
  const res = await fetch(apiUrl("/api/rules"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ user_id: data.userId, delay_hours: data.delayHours, template_id: data.templateId, order: data.order }),
  });
  if (!res.ok) throw new Error("Failed to create rule");
  return res.json();
}

export async function deleteRule(id: number) {
  const res = await fetch(apiUrl(`/api/rules/${id}`), { method: "DELETE", credentials: "include" });
  if (!res.ok && res.status !== 204) throw new Error("Failed to delete rule");
}

// ─── Reminders ──────────────────────────────────────────────────────────────
export async function fetchReminders() {
  const res = await fetch(apiUrl("/api/reminders"), { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch reminders");
  return res.json();
}

export async function createReminder(data: { leadId: number; message: string; scheduledAt: string; type?: string }) {
  const res = await fetch(apiUrl("/api/reminders"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ lead_id: data.leadId, message: data.message, scheduled_at: data.scheduledAt, type: data.type || "follow-up" }),
  });
  if (!res.ok) throw new Error("Failed to create reminder");
  return res.json();
}

export async function deleteReminder(id: number) {
  const res = await fetch(apiUrl(`/api/reminders/${id}`), { method: "DELETE", credentials: "include" });
  if (!res.ok && res.status !== 204) throw new Error("Failed to delete reminder");
}