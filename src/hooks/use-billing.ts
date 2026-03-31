/**
 * use-billing.ts — STUB (billing API not available in backend contract)
 * Kept for type compatibility only. Always returns null data.
 */
import { useQuery } from "@tanstack/react-query";

export function useBillingCurrent() {
  return useQuery({
    queryKey: ["billing", "current"],
    queryFn: async () => null,
    enabled: false, // disabled — /billing not in API contract
  });
}
