import * as React from "react";
import { useAnalyticsSummary } from "@/hooks/use-analytics";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/MetricCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip as RTooltip, CartesianGrid } from "recharts";
import { Loader2, TrendingUp } from "lucide-react";
import { stages } from "@shared/schema";

function pct(v: number) {
  return `${Math.round(v * 100)}%`;
}

export default function AnalyticsPage() {
  const [days, setDays] = React.useState(30);
  const q = useAnalyticsSummary(days);

  const byStage = q.data?.byStage || ({} as any);
  const chartData = stages.map((s) => ({ stage: s, value: byStage?.[s] ?? 0 }));

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 rise-in" data-testid="page-analytics">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl">Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Last 30 days by default. Metric cards + charts. Polished skeleton loading.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={String(days)} onValueChange={(v) => setDays(Number(v))}>
            <SelectTrigger className="w-[170px] rounded-xl focus-ring" data-testid="analytics-days">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="180">Last 180 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="rounded-xl" onClick={() => q.refetch()} data-testid="analytics-refresh">
            Refresh
          </Button>
        </div>
      </div>

      {q.isLoading ? (
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3" data-testid="analytics-skeleton">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="rounded-2xl border-card-border bg-card/70 p-5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-7 w-20 mt-3" />
              <Skeleton className="h-3 w-32 mt-2" />
            </Card>
          ))}
          <Card className="sm:col-span-2 lg:col-span-4 rounded-2xl border-card-border bg-card/70 p-5">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-[260px] w-full mt-4" />
          </Card>
        </div>
      ) : q.isError ? (
        <Card className="surface-glass rounded-2xl mt-5 p-8 text-sm text-destructive" data-testid="analytics-error">
          Failed to load analytics. ({String((q.error as any)?.message || q.error)})
        </Card>
      ) : !q.data ? (
        <Card className="surface-glass rounded-2xl mt-5 p-8 text-sm text-muted-foreground" data-testid="analytics-empty">
          No analytics data.
        </Card>
      ) : (
        <div className="mt-5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <MetricCard label="New leads" value={q.data.leadsNew} hint={`In last ${days} days`} tone="primary" data-testid="metric-leadsNew" />
            <MetricCard label="Active conversations" value={q.data.conversationsActive} hint="With recent activity" tone="muted" data-testid="metric-conversationsActive" />
            <MetricCard label="Messages sent" value={q.data.messagesSent} hint="Outbound volume" tone="primary" data-testid="metric-messagesSent" />
            <MetricCard
              label="Response rate"
              value={pct(q.data.responseRate)}
              hint="Replies / outbound"
              tone="accent"
              right={<TrendingUp className="h-5 w-5 text-primary" />}
              data-testid="metric-responseRate"
            />
          </div>

          <Card className="surface-glass rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-card-border bg-card/60 backdrop-blur flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">Leads by stage</div>
                <div className="text-xs text-muted-foreground">Distribution across pipeline.</div>
              </div>
              {q.isFetching ? (
                <div className="text-xs text-muted-foreground" data-testid="analytics-fetching">
                  <Loader2 className="inline-block h-3.5 w-3.5 animate-spin mr-2" />
                  Updating…
                </div>
              ) : null}
            </div>
            <div className="p-4">
              <div className="h-[320px]" data-testid="analytics-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ left: 6, right: 12, top: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="4 6" opacity={0.3} />
                    <XAxis dataKey="stage" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                    <RTooltip
                      contentStyle={{
                        borderRadius: 14,
                        border: "1px solid rgba(0,0,0,0.06)",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.10)",
                      }}
                    />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[10, 10, 10, 10]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
