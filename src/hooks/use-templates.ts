import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { templatesService } from "@/services/templatesService";
import type { Template } from "@/services/templatesService";

export type { Template };

export function useTemplates(_filters?: { search?: string; status?: string }) {
  return useQuery({
    queryKey: ["templates"],
    queryFn: () => templatesService.list(),
  });
}

export function useCreateTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { name: string; content: string; category?: string | null }) =>
      templatesService.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["templates"] }),
  });
}

export function useUpdateTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { id: number; updates: Partial<{ name: string; content: string; category: string | null }> }) =>
      templatesService.update(input.id, input.updates),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["templates"] }),
  });
}

export function useDeleteTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => templatesService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["templates"] }),
  });
}
