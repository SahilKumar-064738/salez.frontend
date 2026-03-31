/**
 * AutomationPage — DEMO MODE ONLY
 * /automation endpoint does NOT exist in the backend API contract.
 * This page shows an interactive demo of what automation would look like.
 */
import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Sparkles, Wand2, Zap, MessageSquare, Users, Clock, ChevronRight, Play } from "lucide-react";

const DEMO_RULES = [
  {
    id: 1,
    name: "Welcome New Lead",
    enabled: true,
    trigger: "contact.stage = new",
    condition: "Any",
    action: "Send template: Welcome Message",
    runs: 148,
    lastRun: "2 min ago",
    color: "bg-emerald-500",
  },
  {
    id: 2,
    name: "Follow-up After 3 Days",
    enabled: true,
    trigger: "contact.stage = contacted",
    condition: "No reply in 3 days",
    action: "Send template: Follow-up Nudge",
    runs: 92,
    lastRun: "1 hr ago",
    color: "bg-blue-500",
  },
  {
    id: 3,
    name: "Qualified → Send Proposal",
    enabled: false,
    trigger: "contact.stage = qualified",
    condition: "Any",
    action: "Send template: Proposal Ready",
    runs: 34,
    lastRun: "Yesterday",
    color: "bg-violet-500",
  },
  {
    id: 4,
    name: "Re-engage Lost Contacts",
    enabled: true,
    trigger: "contact.stage = lost",
    condition: "30 days since last message",
    action: "Send template: We Miss You",
    runs: 21,
    lastRun: "3 days ago",
    color: "bg-amber-500",
  },
];

const DEMO_TEMPLATES = [
  { icon: "🎉", name: "New Lead Welcome", trigger: "Stage → New", desc: "Sends instant welcome when a new contact is added" },
  { icon: "🔔", name: "Inactivity Follow-up", trigger: "No reply 3d", desc: "Auto follow-up when contact goes quiet" },
  { icon: "📋", name: "Proposal Ready", trigger: "Stage → Qualified", desc: "Sends proposal link when lead is qualified" },
  { icon: "🏆", name: "Deal Won Celebration", trigger: "Stage → Converted", desc: "Congratulates and onboards new customers" },
];

export default function AutomationPage() {
  const [demoRules, setDemoRules] = React.useState(DEMO_RULES);
  const [showBanner, setShowBanner] = React.useState(true);

  const toggleRule = (id: number) => {
    setDemoRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6" data-testid="page-automation">
      {/* Demo Banner */}
      {showBanner && (
        <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 px-5 py-4 flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Demo Mode — Automation Preview</p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
              The Automation API is not yet available. This is an interactive preview of what your automation workflows will look like.
              Toggle rules, explore templates — changes are local only.
            </p>
          </div>
          <button onClick={() => setShowBanner(false)} className="text-amber-500 hover:text-amber-700 text-lg font-bold shrink-0">×</button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Wand2 className="h-6 w-6 text-primary" /> Automation
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Build trigger-based workflows to auto-message your contacts at the right time.</p>
        </div>
        <Button disabled className="gap-2 opacity-60" title="Coming soon">
          <Zap className="h-4 w-4" /> New Rule
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Active Rules", value: demoRules.filter(r => r.enabled).length, icon: Zap, color: "text-emerald-500" },
          { label: "Total Runs", value: demoRules.reduce((a, r) => a + r.runs, 0), icon: Play, color: "text-blue-500" },
          { label: "Contacts Reached", value: "482", icon: Users, color: "text-violet-500" },
        ].map((s) => (
          <Card key={s.label} className="p-4 rounded-xl">
            <div className="flex items-center gap-2">
              <s.icon className={`h-4 w-4 ${s.color}`} />
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
            <div className="mt-2 text-2xl font-bold">{s.value}</div>
          </Card>
        ))}
      </div>

      {/* Rules Table */}
      <Card className="rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h2 className="font-semibold text-sm">Automation Rules</h2>
          <Badge variant="secondary" className="text-[10px]">Demo Data</Badge>
        </div>
        <div className="divide-y divide-border">
          {demoRules.map((rule) => (
            <div key={rule.id} className="px-5 py-4 flex items-start gap-4 hover:bg-muted/20 transition-colors">
              <div className={`h-2 w-2 rounded-full mt-2 shrink-0 ${rule.color}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{rule.name}</span>
                  {rule.enabled && <Badge className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Active</Badge>}
                </div>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
                  <span><strong>When:</strong> {rule.trigger}</span>
                  <span><strong>If:</strong> {rule.condition}</span>
                  <span><strong>Do:</strong> {rule.action}</span>
                </div>
                <div className="mt-1 text-[10px] text-muted-foreground/70">
                  {rule.runs} runs · Last: {rule.lastRun}
                </div>
              </div>
              <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
            </div>
          ))}
        </div>
      </Card>

      {/* Template Gallery */}
      <div>
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" /> Quick-Start Templates
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DEMO_TEMPLATES.map((t) => (
            <Card key={t.name} className="p-4 rounded-xl hover:shadow-md transition-all cursor-default group">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{t.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{t.name}</span>
                    <Badge variant="outline" className="text-[10px]">{t.trigger}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" disabled>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground text-center">Automation API coming soon. Templates will be live once the backend endpoint is available.</p>
      </div>
    </div>
  );
}
