import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { contactsService } from "@/services/contactsService";
import type { Contact } from "@/services/contactsService";

export type { Contact };

/** Returns contacts array directly (unwrapped from ContactListResult) */
export function useContacts(filters?: { search?: string; stage?: string; tag?: string }) {
  return useQuery({
    queryKey: ["contacts", filters || {}],
    queryFn: async () => {
      const result = await contactsService.list(filters);
      return result.contacts;
    },
  });
}

export function useCreateContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; phone: string; stage?: string; tags?: string[] }) =>
      contactsService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contacts"] });
      qc.invalidateQueries({ queryKey: ["pipeline"] });
    },
  });
}

export function useUpdateContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { id: number; updates: Partial<{ name: string; phone: string; stage: string; notes: string }> }) =>
      contactsService.update(input.id, input.updates),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contacts"] });
      qc.invalidateQueries({ queryKey: ["pipeline"] });
    },
  });
}

export function useDeleteContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => contactsService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contacts"] });
      qc.invalidateQueries({ queryKey: ["pipeline"] });
    },
  });
}
