import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { contactsService } from "@/services/contactsService";
import type { Contact } from "@/services/contactsService";

export type { Contact };

export function useContacts(filters?: { search?: string; stage?: string; tag?: string }) {
  return useQuery({
    queryKey: ["contacts", filters || {}],
    queryFn: () => contactsService.list(filters),
  });
}

export function useCreateContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; phone: string; stage?: string }) =>
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
    mutationFn: (input: { id: number; updates: Partial<{ name: string; phone: string; stage: string }> }) =>
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
