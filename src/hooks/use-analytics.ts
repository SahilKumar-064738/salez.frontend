/**
 * src/hooks/use-analytics.ts
 * Backend: GET /analytics/summary, /analytics/messages, /analytics/campaigns
 */
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/apiClient";

export type AnalyticsSummary = {
  totalContacts: number;
  contactsByStage: { stage: string; count: string }[];
  totalMessages: number;
  messagesSent: number;
  messagesReceived: number;
  activeCampaigns: number;
  messagesLast30Days: number;
};

export function useAnalyticsSummary() {
  return useQuery({
    queryKey: ["analytics", "summary"],
    queryFn: async () => {
      try {
        const raw = await apiGet<any>("/analytics/summary");
        const data = raw?.data ?? raw ?? {};
        if (data && (data.totalContacts != null || data.totalMessages != null)) {
          return data as AnalyticsSummary;
        }
        throw new Error("empty");
      } catch {
        // Fallback: aggregate from contacts + inbox endpoints
        try {
          const [contactsRaw, inboxRaw] = await Promise.all([
            apiGet<any>("/contacts", { params: { limit: "100" } }).catch(() => null),
            apiGet<any>("/messages/inbox", { params: { limit: "100" } }).catch(() => null),
          ]);
          const contacts = Array.isArray(contactsRaw?.data ?? contactsRaw)
            ? (contactsRaw?.data ?? contactsRaw)
            : [];
          const inbox = Array.isArray(inboxRaw?.data ?? inboxRaw)
            ? (inboxRaw?.data ?? inboxRaw)
            : [];
          const inbound = inbox.filter((c: any) => (c.lastDirection ?? c.last_direction) === "inbound").length;
          const outbound = inbox.filter((c: any) => (c.lastDirection ?? c.last_direction) === "outbound").length;
          const stageMap: Record<string, number> = {};
          for (const c of contacts) {
            const stage = c.stage ?? "new";
            stageMap[stage] = (stageMap[stage] ?? 0) + 1;
          }
          const contactsByStage = Object.entries(stageMap).map(([stage, count]) => ({
            stage,
            count: String(count),
          }));
          return {
            totalContacts: contacts.length,
            contactsByStage,
            totalMessages: inbox.length,
            messagesSent: outbound,
            messagesReceived: inbound,
            activeCampaigns: 0,
            messagesLast30Days: inbox.length,
          } as AnalyticsSummary;
        } catch {
          return {
            totalContacts: 0,
            contactsByStage: [],
            totalMessages: 0,
            messagesSent: 0,
            messagesReceived: 0,
            activeCampaigns: 0,
            messagesLast30Days: 0,
          } as AnalyticsSummary;
        }
      }
    },
    staleTime: 60_000,
  });
}

export type AnalyticsMessages = {
  byDirection: { direction: string; count: string }[];
  byStatus: { status: string; count: string }[];
  daily: { date: string; count: string }[];
  responseRate: number;
  totalSent: number;
  totalReceived: number;
};

export function useMessageAnalytics(params?: { startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: ["analytics", "messages", params || {}],
    queryFn: async () => {
      try {
        const queryParams: Record<string, string> = {};
        if (params?.startDate) queryParams.startDate = params.startDate;
        if (params?.endDate) queryParams.endDate = params.endDate;
        const raw = await apiGet<any>("/analytics/messages", { params: queryParams });
        return (raw?.data ?? raw ?? {}) as AnalyticsMessages;
      } catch {
        console.warn("Analytics /messages endpoint unavailable, showing empty state");
        return {
          byDirection: [],
          byStatus: [],
          daily: [],
          responseRate: 0,
          totalSent: 0,
          totalReceived: 0,
        } as AnalyticsMessages;
      }
    },
    staleTime: 60_000,
  });
}

export type CampaignsAnalyticsSummary = {
  byStatus: { status: string; count: string }[];
  summary: {
    total_campaigns: string | null;
    total_targeted: string | null;
    total_sent: string | null;
    total_delivered: string | null;
    total_failed: string | null;
  };
  recentCampaigns: any[];
};

export function useCampaignsAnalytics() {
  return useQuery({
    queryKey: ["analytics", "campaigns"],
    queryFn: async () => {
      try {
        const raw = await apiGet<any>("/analytics/campaigns");
        return (raw?.data ?? raw ?? {}) as CampaignsAnalyticsSummary;
      } catch {
        console.warn("Analytics /campaigns endpoint unavailable, showing empty state");
        return {
          byStatus: [],
          summary: {
            total_campaigns: null,
            total_targeted: null,
            total_sent: null,
            total_delivered: null,
            total_failed: null,
          },
          recentCampaigns: [],
        } as CampaignsAnalyticsSummary;
      }
    },
    staleTime: 60_000,
  });
}

export function useDashboardAnalytics() {
  return useQuery({
    queryKey: ["analytics", "dashboard"],
    queryFn: async () => {
      try {
        const raw = await apiGet<any>("/analytics/summary");
        return (raw?.data ?? raw ?? {}) as AnalyticsSummary;
      } catch {
        console.warn("Analytics /summary endpoint unavailable");
        return {} as AnalyticsSummary;
      }
    },
    staleTime: 60_000,
  });
}

// Legacy alias kept for any existing callers
export const useAnalyticsSummaryDays = useAnalyticsSummary;
