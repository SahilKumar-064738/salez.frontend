/**
 * src/hooks/use-automation.ts
 *
 * FIXED: Was a no-op stub (enabled: false, mutationFn: async () => null).
 * Now delegates to automationService which handles URL, payload, and normalization.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  automationService,
  CreateRulePayload,
  NormalizedRule,
} from "@/services/automation";

const QK = ["automation", "rules"] as const;

export function useAutomationRules() {
  return useQuery<NormalizedRule[]>({
    queryKey: QK,
    queryFn: () => automationService.list(),
  });
}

export function useCreateAutomationRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRulePayload) =>
      automationService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK }),
  });
}

export function useUpdateAutomationRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: Partial<CreateRulePayload> & { id: number }) =>
      automationService.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK }),
  });
}

export function useDeleteAutomationRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => automationService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK }),
  });
}

export function useToggleAutomationRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => automationService.toggle(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK }),
  });
}
