import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

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
      // Backend should be: GET /api/billing/current
      return api.get<BillingCurrent>("/api/billing/current");
    },
  });
}
