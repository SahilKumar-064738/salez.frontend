/**
 * src/hooks/use-analytics.ts — FINAL FIXED VERSION
 */

import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/apiClient';

export interface DateRange {
  from_date?: string;
  to_date?: string;
}

// ─────────────────────────────────────────────────────────
// ✅ SUMMARY ANALYTICS (REQUIRED BY YOUR PAGE)
// ─────────────────────────────────────────────────────────

export function useAnalyticsSummary(range?: DateRange) {
  const params: Record<string, string> = {};
  if (range?.from_date) params.from_date = range.from_date;
  if (range?.to_date) params.to_date = range.to_date;

  return useQuery({
    queryKey: ['analytics', 'summary', range],
    queryFn: async () => {
      try {
        const [messagesRes, campaignsRes] = await Promise.all([
          apiGet<{ data: any }>('/analytics/messages', { params }),
          apiGet<{ data: any }>('/analytics/campaigns', { params }),
        ]);

        const m = messagesRes.data.data || {};
        const c = campaignsRes.data.data || {};

        return {
          totalContacts: 0, // TODO: connect contacts API later
          messagesSent: m.sent ?? 0,
          messagesReceived: m.received ?? 0,
          activeCampaigns: c.active ?? 0,
          totalMessages: m.total ?? 0,
          messagesLast30Days: m.total ?? 0,
          contactsByStage: [], // TODO later
        };
      } catch (err) {
        console.error('Summary analytics error:', err);
        return {
          totalContacts: 0,
          messagesSent: 0,
          messagesReceived: 0,
          activeCampaigns: 0,
          totalMessages: 0,
          messagesLast30Days: 0,
          contactsByStage: [],
        };
      }
    },
  });
}

// ─────────────────────────────────────────────────────────
// ✅ MESSAGE ANALYTICS (MATCHES YOUR UI)
// ─────────────────────────────────────────────────────────

export function useMessageAnalytics(range?: DateRange) {
  const params: Record<string, string> = {};
  if (range?.from_date) params.from_date = range.from_date;
  if (range?.to_date) params.to_date = range.to_date;

  return useQuery({
    queryKey: ['analytics', 'messages', range],
    queryFn: async () => {
      try {
        const res = await apiGet<{ data: any }>('/analytics/messages', { params });
        const data = res.data.data || {};

        return {
          daily: data.daily ?? [],
          byDirection: [
            { direction: 'inbound', count: data.received ?? 0 },
            { direction: 'outbound', count: data.sent ?? 0 },
          ],
          byStatus: [
            { status: 'sent', count: data.sent ?? 0 },
            { status: 'delivered', count: data.delivered ?? 0 },
            { status: 'read', count: data.read ?? 0 },
            { status: 'failed', count: data.failed ?? 0 },
          ],
          responseRate: data.sent
            ? (data.received ?? 0) / data.sent
            : 0,
        };
      } catch (err) {
        console.error('Message analytics error:', err);
        return {
          daily: [],
          byDirection: [],
          byStatus: [],
          responseRate: 0,
        };
      }
    },
  });
}

// ─────────────────────────────────────────────────────────
// ✅ CAMPAIGN ANALYTICS (FIXED NAME)
// ─────────────────────────────────────────────────────────

export function useCampaignsAnalytics(range?: DateRange) {
  const params: Record<string, string> = {};
  if (range?.from_date) params.from_date = range.from_date;
  if (range?.to_date) params.to_date = range.to_date;

  return useQuery({
    queryKey: ['analytics', 'campaigns', range],
    queryFn: async () => {
      try {
        const res = await apiGet<{ data: any }>('/analytics/campaigns', { params });
        const data = res.data.data || {};

        return {
          summary: {
            total_campaigns: data.total_campaigns ?? 0,
            total_targeted: data.total_targeted ?? 0,
            total_sent: data.total_sent ?? 0,
            total_delivered: data.total_delivered ?? 0,
          },
        };
      } catch (err) {
        console.error('Campaign analytics error:', err);
        return {
          summary: {
            total_campaigns: 0,
            total_targeted: 0,
            total_sent: 0,
            total_delivered: 0,
          },
        };
      }
    },
  });
}

// ─────────────────────────────────────────────────────────
// (OPTIONAL) KEEP YOUR OLD HOOKS IF NEEDED
// ─────────────────────────────────────────────────────────

export function useCallAnalytics(range?: DateRange) {
  const params: Record<string, string> = {};
  if (range?.from_date) params.from_date = range.from_date;
  if (range?.to_date) params.to_date = range.to_date;

  return useQuery({
    queryKey: ['analytics', 'calls', range],
    queryFn: () =>
      apiGet('/analytics/calls', { params }).then((r) => r.data),
  });
}

export function useLatencyAnalytics(range?: DateRange) {
  const params: Record<string, string> = {};
  if (range?.from_date) params.from_date = range.from_date;
  if (range?.to_date) params.to_date = range.to_date;

  return useQuery({
    queryKey: ['analytics', 'latency', range],
    queryFn: () =>
      apiGet('/analytics/latency', { params }).then((r) => r.data),
  });
}