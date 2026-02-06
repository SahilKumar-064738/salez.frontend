import { apiUrl } from "@/lib/api";

export async function fetchConversations() {
  const res = await fetch(apiUrl("/api/conversations"), { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch conversations");
  return res.json();
}

export async function fetchConversation(id: number) {
  const res = await fetch(apiUrl(`/api/conversations/${id}`), { credentials: "include" });
  if (!res.ok) throw new Error("Conversation not found");
  return res.json();
}

export async function sendMessage(conversationId: number, content: string) {
  const res = await fetch(apiUrl(`/api/conversations/${conversationId}/messages`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error("Failed to send message");
  return res.json();
}
