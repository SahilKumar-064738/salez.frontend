import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { campaignsService } from "@/services/campaignsService";
import type { Campaign } from "@/services/campaignsService";

export type { Campaign };

export function useCampaigns() {
  return useQuery({
    queryKey: ["campaigns"],
    queryFn: () => campaignsService.list(),
  });
}

export function useCreateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { name: string; templateId: number; scheduledAt?: string | null; recipientContactIds?: number[] }) =>
      campaignsService.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["campaigns"] }),
  });
}

export function useUpdateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { id: number; updates: Partial<{ name: string; templateId: number; scheduledAt: string | null; status: string | null }> }) =>
      campaignsService.update(input.id, input.updates),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["campaigns"] }),
  });
}

export function useDeleteCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => campaignsService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["campaigns"] }),
  });
}
