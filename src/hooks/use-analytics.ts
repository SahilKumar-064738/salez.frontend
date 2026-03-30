/**
 * src/hooks/use-analytics.ts
 *
 * Backend contract (all under /api/v1 via apiClient):
 *   GET /analytics/summary
 *   GET /analytics/messages?startDate=...&endDate=...
 *   GET /analytics/campaigns
 *   GET /analytics/campaigns/:id
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
      const raw = await apiGet<any>("/analytics/summary");
      return (raw?.data ?? raw ?? {}) as AnalyticsSummary;
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
      const queryParams: Record<string, string> = {};
      if (params?.startDate) queryParams.startDate = params.startDate;
      if (params?.endDate) queryParams.endDate = params.endDate;
      const raw = await apiGet<any>("/analytics/messages", { params: queryParams });
      return (raw?.data ?? raw ?? {}) as AnalyticsMessages;
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
      const raw = await apiGet<any>(`/analytics/campaigns/${campaignId}`);
      return (raw?.data ?? raw ?? {}) as CampaignAnalytics;
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
      const raw = await apiGet<any>("/analytics/campaigns");
      return (raw?.data ?? raw ?? {}) as CampaignsAnalyticsSummary;
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
      const raw = await apiGet<any>("/analytics/summary");
      return (raw?.data ?? raw ?? {}) as DashboardAnalytics;
    },
  });
}
