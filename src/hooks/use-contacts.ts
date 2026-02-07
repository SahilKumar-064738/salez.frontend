import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type Contact = {
  id: number;
  name: string;
  phone: string;
  email?: string | null;
  stage?: string | null;
  created_at?: string;
  last_message?: string | null;
  message_count?: number;
};

export function useContacts(filters?: {
  search?: string;
  stage?: string;
  tag?: string;
}) {
  return useQuery({
    queryKey: ["contacts", filters || {}],
    queryFn: async () => {
      // Backend returns: { contacts: [], pagination: {} }
      const data = await api.get<any>("/api/contacts");

      const list = data?.contacts || [];

      return (list as any[]).map((c) => ({
        id: c.id,
        name: c.name ?? "Unnamed",
        phone: c.phone ?? "",
        email: c.email ?? null,
        stage: c.stage ?? null,
        created_at: c.created_at,
        last_message: c.last_message ?? null,
        message_count: c.message_count ?? 0,
      })) as Contact[];
    },
  });
}

export function useCreateContact() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      phone: string;
      stage?: string;
    }) => {
      return api.post("/api/contacts", data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contacts"] });
      qc.invalidateQueries({ queryKey: ["pipeline"] });
    },
  });
}

export function useUpdateContact() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      id: number;
      updates: Partial<{
        name: string;
        phone: string;
        stage: string;
      }>;
    }) => {
      return api.put(`/api/contacts/${input.id}`, input.updates);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contacts"] });
      qc.invalidateQueries({ queryKey: ["pipeline"] });
    },
  });
}

export function useDeleteContact() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      return api.delete(`/api/contacts/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contacts"] });
      qc.invalidateQueries({ queryKey: ["pipeline"] });
    },
  });
}
