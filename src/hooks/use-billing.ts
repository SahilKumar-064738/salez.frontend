import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";

function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function useBillingCurrent() {
  return useQuery({
    queryKey: [api.billing.current.path],
    queryFn: async () => {
      const res = await fetch(api.billing.current.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch billing");
      const json = await res.json();
      return parseWithLogging(api.billing.current.responses[200], json, "billing.current");
    },
  });
}
