import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type AutomationRule = {
  id: number;
  business_id: number;
  trigger: string;
  condition: any;
  action: any;
  delay_minutes: number;
  created_at?: string;
};

export function useAutomationRules() {
  return useQuery({
    queryKey: ["automation"],
    queryFn: async () => {
      // Backend: GET /api/automation (returns array)
      const data = await api.get<any[]>("/api/automation");
      return (data || []) as AutomationRule[];
    },
  });
}

export function useCreateAutomationRule() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      trigger: string;
      condition: any;
      action: any;
      delayMinutes?: number;
    }) => {
      // Backend: POST /api/automation
      return api.post<AutomationRule>("/api/automation", input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["automation"] });
    },
  });
}

export function useUpdateAutomationRule() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      id: number;
      updates: Partial<{
        trigger: string;
        condition: any;
        action: any;
        delayMinutes: number;
      }>;
    }) => {
      // Backend: PUT /api/automation/:id
      return api.put<AutomationRule>(`/api/automation/${input.id}`, input.updates);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["automation"] });
    },
  });
}

export function useDeleteAutomationRule() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      // Backend: DELETE /api/automation/:id
      return api.delete(`/api/automation/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["automation"] });
    },
  });
}
