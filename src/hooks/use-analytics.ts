import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

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
      // Backend: GET /api/analytics/summary
      return api.get<AnalyticsSummary>("/api/analytics/summary");
    },
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
      // Backend: GET /api/analytics/messages?startDate=...&endDate=...
      const qs = new URLSearchParams();
      if (params?.startDate) qs.set("startDate", params.startDate);
      if (params?.endDate) qs.set("endDate", params.endDate);

      const url = qs.toString()
        ? `/api/analytics/messages?${qs.toString()}`
        : `/api/analytics/messages`;

      return api.get<AnalyticsMessages>(url);
    },
  });
}

export type CampaignAnalytics = {
  total_sent: number;
  delivered: number;
  replied: number;
};

export function useCampaignAnalytics(campaignId?: number) {
  return useQuery({
    enabled: !!campaignId,
    queryKey: ["analytics", "campaign", campaignId],
    queryFn: async () => {
      // Backend: GET /api/analytics/campaigns/:id
      return api.get<CampaignAnalytics>(`/api/analytics/campaigns/${campaignId}`);
    },
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
      // Backend: GET /api/analytics/campaigns
      return api.get<CampaignsAnalyticsSummary>("/api/analytics/campaigns");
    },
  });
}

export type DashboardAnalytics = {
  totalContacts: number;
  contactsByStage: { stage: string; count: string }[];
  messagesSent: number;
  activeCampaigns: number;
  recentActivity: { date: string; count: string }[];
};

export function useDashboardAnalytics() {
  return useQuery({
    queryKey: ["analytics", "dashboard"],
    queryFn: async () => {
      // Backend: GET /api/analytics/dashboard
      return api.get<DashboardAnalytics>("/api/analytics/dashboard");
    },
  });
}
