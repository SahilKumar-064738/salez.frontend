/**
 * src/hooks/use-automation.ts
 *
 * Backend contract (all under /api/v1 via apiClient):
 *   GET    /automation        list rules
 *   POST   /automation        create rule
 *   PUT    /automation/:id    update rule
 *   DELETE /automation/:id    delete rule
 *
 * The old code used api.get("/api/automation") which bypasses the /v1 prefix.
 * Now uses apiClient wrappers which correctly prefix /api/v1.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/apiClient";

export type AutomationRule = {
  id: number;
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
      try {
        const raw = await apiGet<any>("/automation");
        const list = raw?.data ?? raw ?? [];
        return (Array.isArray(list) ? list : []) as AutomationRule[];
      } catch {
        return [] as AutomationRule[];
      }
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
      const raw = await apiPost<any>("/automation", input);
      return (raw?.data ?? raw) as AutomationRule;
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
      const raw = await apiPut<any>(`/automation/${input.id}`, input.updates);
      return (raw?.data ?? raw) as AutomationRule;
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
      await apiDelete(`/automation/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["automation"] });
    },
  });
}
