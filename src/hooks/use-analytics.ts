/**
 * src/hooks/use-analytics.ts — COMPLETE
 *
 * Covers: calls, messages, campaigns, latency, api-usage analytics.
 * Replaces the stub that existed in the original public zip.
 */

import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/apiClient';

export interface DateRange {
  from_date?: string;
  to_date?: string;
}

// ── Call Analytics ─────────────────────────────────────────────────────────

export interface CallAnalytics {
  total: number;
  completed: number;
  failed: number;
  inbound: number;
  outbound: number;
  avg_duration_s: number;
  total_cost_usd: number;
  period: { from: string; to: string };
}

export function useCallAnalytics(range?: DateRange) {
  const params: Record<string, string> = {};
  if (range?.from_date) params.from_date = range.from_date;
  if (range?.to_date)   params.to_date   = range.to_date;

  return useQuery<CallAnalytics>({
    queryKey: ['analytics', 'calls', range],
    queryFn:  () => apiGet<{ data: CallAnalytics }>('/analytics/calls', { params }).then((r) => r.data),
  });
}

// ── Message Analytics ──────────────────────────────────────────────────────

export interface MessageAnalytics {
  total: number;
  sent: number;
  received: number;
  delivered: number;
  read: number;
  failed: number;
  delivery_rate: number;
  read_rate: number;
  period: { from: string; to: string };
}

export function useMessageAnalytics(range?: DateRange) {
  const params: Record<string, string> = {};
  if (range?.from_date) params.from_date = range.from_date;
  if (range?.to_date)   params.to_date   = range.to_date;

  return useQuery<MessageAnalytics>({
    queryKey: ['analytics', 'messages', range],
    queryFn:  () => apiGet<{ data: MessageAnalytics }>('/analytics/messages', { params }).then((r) => r.data),
  });
}

// ── Campaign Analytics ─────────────────────────────────────────────────────

export interface CampaignAnalytics {
  total_campaigns: number;
  completed: number;
  active: number;
  total_sent: number;
  total_failed: number;
  delivery_rate: number;
  campaigns: unknown[];
  period: { from: string; to: string };
}

export function useCampaignAnalytics(range?: DateRange) {
  const params: Record<string, string> = {};
  if (range?.from_date) params.from_date = range.from_date;
  if (range?.to_date)   params.to_date   = range.to_date;

  return useQuery<CampaignAnalytics>({
    queryKey: ['analytics', 'campaigns', range],
    queryFn:  () => apiGet<{ data: CampaignAnalytics }>('/analytics/campaigns', { params }).then((r) => r.data),
  });
}

// ── Latency Analytics ──────────────────────────────────────────────────────

export interface LatencyAnalytics {
  sample_count: number;
  avg_stt_latency_ms: number | null;
  avg_llm_latency_ms: number | null;
  avg_tts_latency_ms: number | null;
  avg_total_latency_ms: number | null;
  avg_mos_score: number | null;
  period: { from: string; to: string };
}

export function useLatencyAnalytics(range?: DateRange) {
  const params: Record<string, string> = {};
  if (range?.from_date) params.from_date = range.from_date;
  if (range?.to_date)   params.to_date   = range.to_date;

  return useQuery<LatencyAnalytics>({
    queryKey: ['analytics', 'latency', range],
    queryFn:  () => apiGet<{ data: LatencyAnalytics }>('/analytics/latency', { params }).then((r) => r.data),
  });
}