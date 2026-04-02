import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import {
  Zap,
  Plus,
  Trash2,
  Loader2,
  MessageSquare,
  Mail,
  Clock,
  ArrowRight,
  CheckCircle2,
  Circle,
  Layers,
  Settings2,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */

type ServiceType = "GST" | "ITR" | "TDS" | "ROC" | "Other";
type ActionType =
  | "Send WhatsApp Reminder"
  | "Send Email Reminder"
  | "Mark as Due Soon"
  | "Escalate to Senior CA"
  | "Custom";

interface AutomationRule {
  id: number;
  service_type: ServiceType;
  delay_days: number;
  action: ActionType | string;
  enabled: boolean;
  created_at?: string;
  trigger_count?: number;
}

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */

const SERVICE_TYPES: ServiceType[] = ["GST", "ITR", "TDS", "ROC", "Other"];

const ACTION_TYPES: ActionType[] = [
  "Send WhatsApp Reminder",
  "Send Email Reminder",
  "Mark as Due Soon",
  "Escalate to Senior CA",
  "Custom",
];

const ACTION_ICONS: Record<string, React.ElementType> = {
  "Send WhatsApp Reminder": MessageSquare,
  "Send Email Reminder": Mail,
  "Mark as Due Soon": Clock,
  "Escalate to Senior CA": Settings2,
  Custom: Zap,
};

const SERVICE_COLORS: Record<ServiceType, { pill: string; dot: string }> = {
  GST: {
    pill: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    dot: "bg-sky-500",
  },
  ITR: {
    pill: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
    dot: "bg-violet-500",
  },
  TDS: {
    pill: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
    dot: "bg-teal-500",
  },
  ROC: {
    pill: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    dot: "bg-orange-500",
  },
  Other: {
    pill: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    dot: "bg-slate-400",
  },
};

/* ─────────────────────────────────────────────
   SMALL UI COMPONENTS
───────────────────────────────────────────── */

function ServicePill({ type }: { type: ServiceType }) {
  const { pill } = SERVICE_COLORS[type] || SERVICE_COLORS.Other;
  return (
    <span
      className={cn(
        "inline-block rounded-md px-2.5 py-0.5 text-[11px] font-bold tracking-widest uppercase",
        pill,
      )}
    >
      {type}
    </span>
  );
}

function ActionIcon({ action }: { action: string }) {
  const Icon = ACTION_ICONS[action] || Zap;
  return <Icon className="h-4 w-4" />;
}

function RuleCard({
  rule,
  onToggle,
  onDelete,
  deleting,
  toggling,
}: {
  rule: AutomationRule;
  onToggle: (rule: AutomationRule) => void;
  onDelete: (id: number) => void;
  deleting: number | null;
  toggling: number | null;
}) {
  return (
    <div
      className={cn(
        "group relative flex items-start gap-4 p-5 rounded-2xl border transition-all duration-200",
        rule.enabled
          ? "border-border/60 bg-card hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-sm"
          : "border-border/40 bg-muted/30 opacity-60",
      )}
    >
      {/* Status dot */}
      <div className="flex-shrink-0 mt-0.5">
        <div
          className={cn(
            "w-2 h-2 rounded-full mt-1 transition-colors",
            rule.enabled
              ? "bg-emerald-500 shadow-sm shadow-emerald-500/50"
              : "bg-muted-foreground/30",
          )}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-3">
        {/* Top row: service + arrow + action */}
        <div className="flex items-center gap-2 flex-wrap">
          <ServicePill type={rule.service_type} />
          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          <div className="flex items-center gap-1.5 text-sm font-medium">
            <ActionIcon action={rule.action} />
            <span className="truncate">{rule.action}</span>
          </div>
        </div>

        {/* Bottom row: delay + stats */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>
              Triggers <strong>{rule.delay_days} days</strong> after record
              creation
            </span>
          </div>
          {rule.trigger_count !== undefined && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Zap className="h-3 w-3" />
              <span>
                Triggered <strong>{rule.trigger_count}×</strong>
              </span>
            </div>
          )}
          {rule.created_at && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>
                Created{" "}
                {new Date(rule.created_at).toLocaleDateString(undefined, {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {toggling === rule.id ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : (
          <Switch
            checked={rule.enabled}
            onCheckedChange={() => onToggle(rule)}
            className="data-[state=checked]:bg-indigo-600"
          />
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={() => onDelete(rule.id)}
          disabled={deleting === rule.id}
        >
          {deleting === rule.id ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Trash2 className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   AUTOMATION FORM
───────────────────────────────────────────── */

function AutomationForm({
  onSave,
  onClose,
  saving,
}: {
  onSave: (
    data: Omit<AutomationRule, "id" | "created_at" | "trigger_count">,
  ) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const [service, setService] = React.useState<ServiceType>("GST");
  const [delayDays, setDelayDays] = React.useState<number>(7);
  const [actionType, setActionType] = React.useState<ActionType | string>(
    "Send WhatsApp Reminder",
  );
  const [customAction, setCustomAction] = React.useState("");

  const isCustom = actionType === "Custom";
  const finalAction = isCustom ? customAction : actionType;
  const isValid = finalAction.trim() && delayDays > 0;

  return (
    <div className="space-y-5 py-2">
      {/* Service type */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Service Type
        </label>
        <Select
          value={service}
          onValueChange={(v) => setService(v as ServiceType)}
        >
          <SelectTrigger className="rounded-xl h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SERVICE_TYPES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Action */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Action
        </label>
        <Select value={actionType} onValueChange={setActionType}>
          <SelectTrigger className="rounded-xl h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ACTION_TYPES.map((a) => (
              <SelectItem key={a} value={a}>
                <span className="flex items-center gap-2">
                  <ActionIcon action={a} />
                  {a}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isCustom && (
          <Input
            value={customAction}
            onChange={(e) => setCustomAction(e.target.value)}
            placeholder="Describe your custom action…"
            className="rounded-xl h-9 mt-2"
          />
        )}
      </div>

      {/* Delay days */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
          <span>Trigger After</span>
          <span className="text-indigo-600 font-bold text-sm">
            {delayDays} days
          </span>
        </label>
        <input
          type="range"
          min={1}
          max={365}
          value={delayDays}
          onChange={(e) => setDelayDays(Number(e.target.value))}
          className="w-full accent-indigo-600"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>1 day</span>
          <span>365 days</span>
        </div>

        {/* Preview */}
        <div className="rounded-xl border border-dashed border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30 p-3 flex items-center gap-2.5">
          <Zap className="h-4 w-4 text-indigo-500 flex-shrink-0" />
          <p className="text-[12px] text-indigo-700 dark:text-indigo-300">
            When a <strong>{service}</strong> record is created,{" "}
            <strong>"{finalAction || "your action"}"</strong> will fire after{" "}
            <strong>{delayDays} days</strong>.
          </p>
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <Button
          variant="outline"
          onClick={onClose}
          className="flex-1 rounded-xl h-9"
        >
          Cancel
        </Button>
        <Button
          onClick={() =>
            onSave({
              service_type: service,
              delay_days: delayDays,
              action: finalAction,
              enabled: true,
            })
          }
          disabled={saving || !isValid}
          className="flex-1 rounded-xl h-9 bg-indigo-600 hover:bg-indigo-700 shadow-md"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          Create Rule
        </Button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */

export default function AutomationPage() {
  const { toast } = useToast();

  const [rules, setRules] = React.useState<AutomationRule[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState<number | null>(null);
  const [toggling, setToggling] = React.useState<number | null>(null);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [filterService, setFilterService] = React.useState<string>("all");

  /* ── FETCH ── */
  const fetchRules = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<any>("/api/v1/automation");
      const data = (res as any)?.data || res || [];
      setRules(Array.isArray(data) ? data : []);
    } catch {
      setRules([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  /* ── CREATE ── */
  const handleCreate = async (
    data: Omit<AutomationRule, "id" | "created_at" | "trigger_count">,
  ) => {
    setSaving(true);
    try {
      await api.post("/api/v1/automation", data);
      toast({ title: "Automation rule created 🚀" });
      setCreateOpen(false);
      fetchRules();
    } catch {
      toast({ title: "Error creating rule", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  /* ── DELETE ── */
  const handleDelete = async (id: number) => {
    setDeleting(id);
    try {
      await api.delete(`/api/v1/automation/${id}`);
      toast({ title: "Rule deleted" });
      setRules((prev) => prev.filter((r) => r.id !== id));
    } catch {
      toast({ title: "Failed to delete rule", variant: "destructive" });
    } finally {
      setDeleting(null);
    }
  };

  /* ── TOGGLE ── */
  const handleToggle = async (rule: AutomationRule) => {
    setToggling(rule.id);
    const updated = { ...rule, enabled: !rule.enabled };
    setRules((prev) => prev.map((r) => (r.id === rule.id ? updated : r)));
    try {
      await api.patch(`/api/v1/automation/${rule.id}`, updated);
    } catch {
      // revert on failure
      setRules((prev) => prev.map((r) => (r.id === rule.id ? rule : r)));
      toast({ title: "Failed to update rule", variant: "destructive" });
    } finally {
      setToggling(null);
    }
  };

  /* ── DERIVED ── */
  const filtered = React.useMemo(
    () =>
      filterService === "all"
        ? rules
        : rules.filter((r) => r.service_type === filterService),
    [rules, filterService],
  );

  const counts = React.useMemo(
    () => ({
      total: rules.length,
      active: rules.filter((r) => r.enabled).length,
      inactive: rules.filter((r) => !r.enabled).length,
    }),
    [rules],
  );

  /* ─────────────────── RENDER ─── */
  return (
    <div
      className="max-w-[900px] mx-auto px-6 py-8 space-y-6"
      data-testid="page-automation"
    >
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">
            Workflow Engine
          </p>
          <h1 className="text-[28px] font-bold tracking-tight flex items-center gap-2.5 leading-none">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white">
              <Zap className="h-4 w-4" />
            </span>
            Automation Rules
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Trigger WhatsApp reminders, emails, and actions automatically.
          </p>
        </div>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-md h-9">
              <Plus className="h-4 w-4" /> New Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Automation Rule</DialogTitle>
            </DialogHeader>
            <AutomationForm
              onSave={handleCreate}
              onClose={() => setCreateOpen(false)}
              saving={saving}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "Total Rules",
            value: counts.total,
            icon: Layers,
            cls: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
          },
          {
            label: "Active",
            value: counts.active,
            icon: CheckCircle2,
            cls: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
          },
          {
            label: "Paused",
            value: counts.inactive,
            icon: Circle,
            cls: "bg-slate-50 text-slate-500 dark:bg-slate-800/30 dark:text-slate-400",
          },
        ].map((s) => (
          <Card
            key={s.label}
            className="p-4 rounded-2xl border border-border/60 shadow-sm flex items-center gap-3"
          >
            <div className={cn("p-2 rounded-xl", s.cls)}>
              <s.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xl font-bold tracking-tight">{s.value}</p>
              <p className="text-xs text-muted-foreground font-medium">
                {s.label}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* ── How it works banner ── */}
      <div className="rounded-xl border border-indigo-200 dark:border-indigo-800/50 bg-indigo-50/60 dark:bg-indigo-950/30 px-5 py-4">
        <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2">
          How Automation Works
        </p>
        <div className="flex items-center gap-2 flex-wrap text-xs text-indigo-700 dark:text-indigo-300">
          <span className="font-medium">Record Created</span>
          <ArrowRight className="h-3 w-3 opacity-60" />
          <span className="font-medium">Wait N days</span>
          <ArrowRight className="h-3 w-3 opacity-60" />
          <span className="font-medium">Trigger Action</span>
          <ArrowRight className="h-3 w-3 opacity-60" />
          <span className="font-medium">Client Notified ✅</span>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <Select value={filterService} onValueChange={setFilterService}>
          <SelectTrigger className="w-[150px] h-9 rounded-xl text-sm">
            <SelectValue placeholder="All services" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All services</SelectItem>
            {SERVICE_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {filterService !== "all" && (
          <Button
            variant="ghost"
            size="sm"
            className="h-9 rounded-xl text-xs text-muted-foreground"
            onClick={() => setFilterService("all")}
          >
            Clear
          </Button>
        )}
        <span className="ml-auto text-xs text-muted-foreground">
          {filtered.length} rule{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Rules List ── */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
            <Zap className="h-6 w-6 text-muted-foreground/40" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground">
              {rules.length === 0
                ? "No automation rules yet"
                : "No rules for this service"}
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              {rules.length === 0
                ? "Create your first rule to start automating"
                : "Try selecting a different service filter"}
            </p>
          </div>
          {rules.length === 0 && (
            <Button
              size="sm"
              className="rounded-xl mt-1 bg-indigo-600 hover:bg-indigo-700"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1.5" /> Create First Rule
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((rule) => (
            <RuleCard
              key={rule.id}
              rule={rule}
              onToggle={handleToggle}
              onDelete={handleDelete}
              deleting={deleting}
              toggling={toggling}
            />
          ))}
        </div>
      )}

      {/* ── Footer tip ── */}
      {!loading && rules.length > 0 && (
        <p className="text-[11px] text-muted-foreground text-center pt-2">
          Toggle the switch to pause/resume any rule without deleting it.
        </p>
      )}
    </div>
  );
}
