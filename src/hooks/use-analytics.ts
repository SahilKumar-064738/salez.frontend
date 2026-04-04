import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/api';

export interface DateRange {
  from_date?: string;
  to_date?: string;
}

export function useAnalyticsSummary(range?: DateRange) {
  return useQuery({
    queryKey: ['analytics', 'summary', range],
    queryFn: async () => {
      try {
        const params =
          range?.from_date || range?.to_date
            ? {
                from_date: range?.from_date,
                to_date: range?.to_date,
              }
            : undefined;

        // ✅ Fetch analytics
        const [m, c] = await Promise.all([
          api.analytics.messages(params) as any,
          api.analytics.campaigns(params) as any,
        ]);

        // ✅ Fetch ALL contacts (pagination)
        let allContacts: any[] = [];
        let cursor: string | undefined = undefined;

        while (true) {
          const res = await api.contacts.list({
            cursor,
            limit: 100,
          });

          const list = res?.data || [];

          allContacts = [...allContacts, ...list];

          if (!res?.hasMore) break;

          cursor = res?.nextCursor || undefined;
        }

        // 🔥 FIX: group contacts by stage
        const stageMap: Record<string, number> = {};

        allContacts.forEach((c: any) => {
          const stage = (c?.stage || "unknown").toLowerCase();
          stageMap[stage] = (stageMap[stage] || 0) + 1;
        });

        const contactsByStage = Object.entries(stageMap).map(
          ([stage, count]) => ({
            stage,
            count,
          })
        );

        return {
          totalContacts: allContacts.length,
          messagesSent: m?.total ?? 0,
          messagesReceived: m?.delivered ?? 0,
          activeCampaigns: c?.total_campaigns ?? 0,
          totalMessages: m?.total ?? 0,
          messagesLast30Days: m?.total ?? 0,
          contactsByStage, // ✅ FIXED
        };
      } catch (err) {
        console.error("Analytics error:", err);
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

export function useMessageAnalytics(range?: DateRange) {
  return useQuery({
    queryKey: ['analytics', 'messages', range],
    queryFn: async () => {
      try {
        const data = await api.analytics.messages({
          from_date: range?.from_date,
          to_date: range?.to_date,
        }) as any;

        return {
          daily: data?.daily ?? [],
          byDirection: [
            { direction: 'inbound', count: data?.read ?? 0 },
            { direction: 'outbound', count: data?.total ?? 0 },
          ],
          byStatus: [
            { status: 'sent', count: data?.sent ?? 0 },
            { status: 'delivered', count: data?.delivered ?? 0 },
            { status: 'read', count: data?.read ?? 0 },
            { status: 'failed', count: data?.failed ?? 0 },
          ],
          responseRate: data?.total
            ? (data?.read ?? 0) / data.total
            : 0,
        };
      } catch (err) {
        console.error("Message analytics error:", err);
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

export function useCampaignsAnalytics(range?: DateRange) {
  return useQuery({
    queryKey: ['analytics', 'campaigns', range],
    queryFn: async () => {
      try {
        const data = await api.analytics.campaigns({
          from_date: range?.from_date,
          to_date: range?.to_date,
        }) as any;

        return {
          summary: {
            total_campaigns: data?.total_campaigns ?? 0,
            total_targeted: data?.total_targeted ?? 0,
            total_sent: data?.total_sent ?? 0,
            total_delivered: data?.total_delivered ?? 0,
          },
        };
      } catch (err) {
        console.error("Campaign analytics error:", err);
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

export function useCallAnalytics(range?: DateRange) {
  return useQuery({
    queryKey: ['analytics', 'calls', range],
    queryFn: async () => null,
    enabled: false,
  });
}

export function useLatencyAnalytics(range?: DateRange) {
  return useQuery({
    queryKey: ['analytics', 'latency', range],
    queryFn: async () => null,
    enabled: false,
  });
}