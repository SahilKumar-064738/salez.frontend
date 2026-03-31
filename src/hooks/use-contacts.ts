import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { contactsService } from "@/services/contactsService";
import type { Contact } from "@/services/contactsService";

export type { Contact };

/**
 * Returns contacts array directly (unwrapped from ContactListResult).
 * Limit is capped at 100 per API contract.
 */
export function useContacts(filters?: { search?: string; stage?: string; tag?: string; limit?: number }) {
  return useQuery({
    queryKey: ["contacts", filters || {}],
    queryFn: async () => {
      const result = await contactsService.list({
        ...filters,
        limit: Math.min(filters?.limit ?? 100, 100), // enforce ≤ 100
      });
      return result.contacts;
    },
  });
}

export function useCreateContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; phone: string; stage?: string; notes?: string; tags?: string[] }) =>
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
    mutationFn: (input: {
      id: number;
      updates: Partial<{ name: string; stage: string; notes: string; email: string }>;
    }) => contactsService.update(input.id, input.updates),
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

export function useAddTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ contactId, tag }: { contactId: number; tag: string }) =>
      contactsService.addTag(contactId, tag),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contacts"] }),
  });
}

export function useRemoveTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ contactId, tag }: { contactId: number; tag: string }) =>
      contactsService.removeTag(contactId, tag),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contacts"] }),
  });
}

export function usePipelineStats() {
  return useQuery({
    queryKey: ["contacts", "pipeline-stats"],
    queryFn: () => contactsService.pipelineStats(),
    staleTime: 60_000,
  });
}
