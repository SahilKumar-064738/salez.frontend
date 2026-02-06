import { apiUrl } from "@/lib/api";

export async function fetchTemplates() {
  const res = await fetch(apiUrl("/api/templates"), { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch templates");
  return res.json();
}

export async function createTemplate(data: { userId: number; name: string; content: string; category: string }) {
  const res = await fetch(apiUrl("/api/templates"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ user_id: data.userId, ...data }),
  });
  if (!res.ok) throw new Error("Failed to create template");
  return res.json();
}

export async function updateTemplate(id: number, data: { name?: string; content?: string; category?: string }) {
  const res = await fetch(apiUrl(`/api/templates/${id}`), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update template");
  return res.json();
}

export async function deleteTemplate(id: number) {
  const res = await fetch(apiUrl(`/api/templates/${id}`), { method: "DELETE", credentials: "include" });
  if (!res.ok && res.status !== 204) throw new Error("Failed to delete template");
}
