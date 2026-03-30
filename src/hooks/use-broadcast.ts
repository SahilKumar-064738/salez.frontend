/**
 * src/hooks/use-broadcast.ts
 *
 * Backend contract (all under /api/v1 via campaignsService):
 *   GET    /campaigns             list campaigns
 *   POST   /campaigns             create (contactIds, not recipientContactIds)
 *   PUT    /campaigns/:id         update
 *   DELETE /campaigns/:id         delete
 *   POST   /campaigns/:id/send    trigger dispatch
 *   POST   /campaigns/:id/cancel  cancel
 */

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
    mutationFn: (input: {
      name: string;
      templateId: number;
      whatsappAccountId: number;
      scheduledAt?: string | null;
      contactIds?: number[];        // ← correct field name (was recipientContactIds)
    }) => campaignsService.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["campaigns"] }),
  });
}

export function useSendCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => campaignsService.send(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["campaigns"] }),
  });
}

export function useCancelCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => campaignsService.cancel(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["campaigns"] }),
  });
}

export function useUpdateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      id: number;
      updates: Partial<{
        name: string;
        templateId: number;
        whatsappAccountId: number;
        scheduledAt: string | null;
      }>;
    }) => campaignsService.update(input.id, input.updates),
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
