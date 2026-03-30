/**
 * src/hooks/use-billing.ts
 *
 * Backend contract (all under /api/v1 via apiClient):
 *   GET /billing/current  — current plan and usage
 *
 * The old /api/billing path was missing the /v1 prefix.
 */

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/apiClient";

export type BillingCurrent = {
  planName: string;
  priceMonthly: number;
  contactsUsed: number;
  contactsLimit: number;
  messagesUsed: number;
  messagesLimit: number;
};

export function useBillingCurrent() {
  return useQuery({
    queryKey: ["billing", "current"],
    queryFn: async () => {
      try {
        const raw = await apiGet<any>("/billing/current");
        return (raw?.data ?? raw ?? {}) as BillingCurrent;
      } catch {
        // Billing endpoint may not exist in all environments — return safe defaults
        return {
          planName: "Free",
          priceMonthly: 0,
          contactsUsed: 0,
          contactsLimit: 100,
          messagesUsed: 0,
          messagesLimit: 1000,
        } as BillingCurrent;
      }
    },
  });
}
