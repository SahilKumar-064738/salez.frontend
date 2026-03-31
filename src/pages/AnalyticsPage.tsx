import * as React from "react";
import { useAnalyticsSummary, useMessageAnalytics, useCampaignsAnalytics } from "@/hooks/use-analytics";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, LineChart, Line } from "recharts";
import { BarChart3, MessageSquare, Users, Send, TrendingUp, Activity } from "lucide-react";

function MetricCard({ label, value, hint, icon: Icon, trend }: {
  label: string; value: any; hint?: string; icon?: any; trend?: string;
}) {
  return (
    <Card className="p-4 rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</span>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground/50" />}
      </div>
      <div className="text-2xl font-bold">{value ?? "—"}</div>
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
      {trend && <Badge variant="secondary" className="text-[10px] mt-1">{trend}</Badge>}
    </Card>
  );
}

function SkelCard() {
  return (
    <Card className="p-4 rounded-xl space-y-2">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-6 w-16 mt-1" />
      <Skeleton className="h-3 w-28 mt-1" />
    </Card>
  );
}

export default function AnalyticsPage() {
  const [range, setRange] = React.useState<"7" | "30" | "90">("30");

  const summaryQ = useAnalyticsSummary();
  const msgQ = useMessageAnalytics();
  const campQ = useCampaignsAnalytics();

  const isLoading = summaryQ.isLoading;
  const s = summaryQ.data;
  const m = msgQ.data;
  const camp = campQ.data;

  // Build chart data from contactsByStage
  const stageChartData = React.useMemo(() => {
    if (!s?.contactsByStage) return [];
    return (s.contactsByStage as any[]).map((row: any) => ({
      name: row.stage ?? row.name ?? "?",
      value: Number(row.count ?? row.value ?? 0),
    }));
  }, [s?.contactsByStage]);

  // Build daily messages chart
  const dailyChartData = React.useMemo(() => {
    if (!m?.daily) return [];
    return (m.daily as any[]).slice(-14).map((row: any) => ({
      date: new Date(row.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      count: Number(row.count ?? 0),
    }));
  }, [m?.daily]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6" data-testid="page-analytics">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" /> Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time insights from your WhatsApp campaigns and contacts.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={range} onValueChange={(v) => setRange(v as any)}>
            <SelectTrigger className="w-[140px] h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => { summaryQ.refetch(); msgQ.refetch(); campQ.refetch(); }}>
            Refresh
          </Button>
        </div>
      </div>

      {/* No data notice */}
      {!isLoading && !s?.totalContacts && !s?.totalMessages && (
        <Card className="p-4 rounded-xl border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 text-sm text-amber-700 dark:text-amber-400">
          No analytics data yet. Start by adding contacts and sending messages.
        </Card>
      )}

      {/* Summary metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {isLoading ? Array.from({ length: 6 }).map((_, i) => <SkelCard key={i} />) : (
          <>
            <MetricCard label="Total Contacts" value={s?.totalContacts?.toLocaleString() ?? "—"} icon={Users} hint="All stages" />
            <MetricCard label="Messages Sent" value={s?.messagesSent?.toLocaleString() ?? "—"} icon={Send} hint="Outbound" />
            <MetricCard label="Messages Recv" value={s?.messagesReceived?.toLocaleString() ?? "—"} icon={MessageSquare} hint="Inbound" />
            <MetricCard label="Active Campaigns" value={s?.activeCampaigns ?? "—"} icon={Activity} hint="Running now" />
            <MetricCard label="Total Messages" value={s?.totalMessages?.toLocaleString() ?? "—"} icon={TrendingUp} hint="All time" />
            <MetricCard label="Last 30d" value={s?.messagesLast30Days?.toLocaleString() ?? "—"} icon={BarChart3} hint="Messages" />
          </>
        )}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Contacts by stage */}
        <Card className="p-5 rounded-2xl">
          <h3 className="font-semibold text-sm mb-4">Contacts by Stage</h3>
          {isLoading ? <Skeleton className="h-48 w-full" /> : stageChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stageChartData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} width={36} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">No stage data yet</div>
          )}
        </Card>

        {/* Daily messages */}
        <Card className="p-5 rounded-2xl">
          <h3 className="font-semibold text-sm mb-4">Daily Messages (last 14 days)</h3>
          {msgQ.isLoading ? <Skeleton className="h-48 w-full" /> : dailyChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={dailyChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} width={36} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">No daily data yet</div>
          )}
        </Card>
      </div>

      {/* Message stats */}
      {m && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-5 rounded-2xl">
            <h3 className="font-semibold text-sm mb-3">By Direction</h3>
            <div className="space-y-2">
              {(m.byDirection || []).map((row: any) => (
                <div key={row.direction} className="flex items-center justify-between text-sm">
                  <span className="capitalize text-muted-foreground">{row.direction}</span>
                  <span className="font-semibold">{Number(row.count).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5 rounded-2xl">
            <h3 className="font-semibold text-sm mb-3">By Status</h3>
            <div className="space-y-2">
              {(m.byStatus || []).map((row: any) => (
                <div key={row.status} className="flex items-center justify-between text-sm">
                  <span className="capitalize text-muted-foreground">{row.status}</span>
                  <span className="font-semibold">{Number(row.count).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5 rounded-2xl">
            <h3 className="font-semibold text-sm mb-3">Response Rate</h3>
            <div className="text-3xl font-bold">
              {m.responseRate != null ? `${(m.responseRate * 100).toFixed(1)}%` : "—"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Inbound replies ÷ outbound sent</p>
          </Card>
        </div>
      )}

      {/* Campaign analytics */}
      {camp && (
        <Card className="p-5 rounded-2xl">
          <h3 className="font-semibold text-sm mb-4">Campaign Performance</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Total Campaigns", value: camp.summary?.total_campaigns },
              { label: "Total Targeted", value: camp.summary?.total_targeted },
              { label: "Messages Sent", value: camp.summary?.total_sent },
              { label: "Delivered", value: camp.summary?.total_delivered },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-xl font-bold">{s.value ? Number(s.value).toLocaleString() : "—"}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
