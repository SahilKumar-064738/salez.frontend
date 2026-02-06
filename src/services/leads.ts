import { apiUrl } from "@/lib/api";

export async function fetchLeads() {
  const res = await fetch(apiUrl("/api/leads"), { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch leads");
  return res.json();
}

export async function fetchLead(id: number) {
  const res = await fetch(apiUrl(`/api/leads/${id}`), { credentials: "include" });
  if (!res.ok) throw new Error("Lead not found");
  return res.json();
}

export async function createLead(data: { name: string; phone: string; status?: string }) {
  const res = await fetch(apiUrl("/api/leads"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create lead");
  return res.json();
}

export async function updateLead(id: number, data: { name?: string; phone?: string; status?: string }) {
  const res = await fetch(apiUrl(`/api/leads/${id}`), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update lead");
  return res.json();
}

export async function deleteLead(id: number) {
  const res = await fetch(apiUrl(`/api/leads/${id}`), {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok && res.status !== 204) throw new Error("Failed to delete lead");
}
