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

export function useAnalyticsSummary(days = 30) {
  return useQuery({
    queryKey: [api.analytics.summary.path, { days }],
    queryFn: async () => {
      const u = new URL(api.analytics.summary.path, window.location.origin);
      u.searchParams.set("days", String(days));
      const res = await fetch(u.toString().replace(window.location.origin, ""), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch analytics");
      const json = await res.json();
      return parseWithLogging(api.analytics.summary.responses[200], json, "analytics.summary");
    },
  });
}
