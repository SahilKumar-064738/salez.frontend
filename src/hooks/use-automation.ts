/**
 * use-automation.ts — STUB (automation API not available in backend contract)
 * Kept for import compatibility. All mutations are no-ops.
 */
import { useMutation, useQuery } from "@tanstack/react-query";

export function useAutomationRules() {
  return useQuery({
    queryKey: ["automation", "rules"],
    queryFn: async () => [] as any[],
    enabled: false,
  });
}

export function useCreateAutomationRule() {
  return useMutation({ mutationFn: async (_: any) => null });
}

export function useUpdateAutomationRule() {
  return useMutation({ mutationFn: async (_: any) => null });
}
