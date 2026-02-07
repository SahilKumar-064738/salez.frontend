import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type Campaign = {
  id: number;
  business_id: number;
  template_id: number;
  name: string;
  scheduled_at: string | null;
  status: string | null;

  // returned from JOIN
  template_name?: string | null;
};

export function useCampaigns() {
  return useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => {
      // Backend: GET /api/campaigns (returns array)
      const data = await api.get<any[]>("/api/campaigns");
      return (data || []) as Campaign[];
    },
  });
}

export function useCreateCampaign() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      name: string;
      templateId: number;
      scheduledAt?: string | null;
      status?: string | null;
    }) => {
      // Backend: POST /api/campaigns
      return api.post<Campaign>("/api/campaigns", {
        name: input.name,
        templateId: input.templateId,
        scheduledAt: input.scheduledAt ?? null,
        status: input.status ?? null,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}

export function useUpdateCampaign() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      id: number;
      updates: Partial<{
        name: string;
        templateId: number;
        scheduledAt: string | null;
        status: string | null;
      }>;
    }) => {
      // Backend: PUT /api/campaigns/:id
      return api.put<Campaign>(`/api/campaigns/${input.id}`, input.updates);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}

export function useDeleteCampaign() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      // Backend: DELETE /api/campaigns/:id
      return api.delete(`/api/campaigns/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}
