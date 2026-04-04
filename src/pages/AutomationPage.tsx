import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Search,
  RefreshCw,
  Activity,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */

type ServiceType = "GST" | "ITR" | "TDS" | "ROC" | "Other";
type ActionType = "whatsapp" | "email" | "mark_due_soon" | "escalate";

interface ActionConfig {
  type: ActionType;
  template_id?: number | null;
  delay_days: number;
}

interface ApprovedTemplate {
  id: number;
  name: string;
  category: string;
  variables: string[];
}

interface AutomationRule {
  id: number;
  name: string;
  service_type: ServiceType;
  trigger_type: string;
  conditions: { service_type: ServiceType };
  actions: ActionConfig[];
  enabled: boolean;
  created_at?: string;
  trigger_count?: number;
}

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */

const SERVICE_TYPES: ServiceType[] = ["GST", "ITR", "TDS", "ROC", "Other"];

const ACTION_DEFINITIONS: {
  type: ActionType;
  label: string;
  icon: React.ElementType;
  needsTemplate: boolean;
  color: string;
  bg: string;
}[] = [
  {
    type: "whatsapp",
    label: "Send WhatsApp Reminder",
    icon: MessageSquare,
    needsTemplate: true,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
  },
  {
    type: "email",
    label: "Send Email Reminder",
    icon: Mail,
    needsTemplate: true,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    type: "mark_due_soon",
    label: "Mark as Due Soon",
    icon: Clock,
    needsTemplate: false,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20",
  },
  {
    type: "escalate",
    label: "Escalate to Senior CA",
    icon: Settings2,
    needsTemplate: false,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-900/20",
  },
];

const SERVICE_COLORS: Record<ServiceType, string> = {
  GST: "bg-sky-100 text-sky-700 border border-sky-200 dark:bg-sky-900/40 dark:text-sky-300 dark:border-sky-800",
  ITR: "bg-violet-100 text-violet-700 border border-violet-200 dark:bg-violet-900/40 dark:text-violet-300 dark:border-violet-800",
  TDS: "bg-teal-100 text-teal-700 border border-teal-200 dark:bg-teal-900/40 dark:text-teal-300 dark:border-teal-800",
  ROC: "bg-orange-100 text-orange-700 border border-orange-200 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-800",
  Other:
    "bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
};

/* ─────────────────────────────────────────────
   FIXED HOOK — useApprovedTemplates
   Fixes:
   1. Correct endpoint: /api/v1/campaigns/templates
   2. Correct response parsing: res.data.data
   3. Client-side filter: status === "Approved"
   4. Cancellation on unmount
   5. Defensive field mapping
───────────────────────────────────────────── */

function useApprovedTemplates() {
  const [templates, setTemplates] = React.useState<ApprovedTemplate[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    api
      .get<{ success: boolean; data: unknown }>("/api/v1/campaigns/templates")
      .then((res) => {
        if (cancelled) return;

        // Backend: { success, data: [...] }
        // api wrapper may unwrap once → res.data is the body → actual array at res.data.data
        const raw =
          (res as any)?.data?.data ?? (res as any)?.data ?? (res as any) ?? [];

        const list: unknown[] = Array.isArray(raw) ? raw : [];

        const approved: ApprovedTemplate[] = list
          .filter(
            (t: any) => String(t?.status || "").toLowerCase() === "approved",
          )
          .map((t: any) => ({
            id: Number(t.id),
            name: String(t.name ?? ""),
            category: String(t.category ?? ""),
            variables: Array.isArray(t.variables)
              ? t.variables.map(String)
              : [],
          }));

        setTemplates(approved);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Failed to load templates");
          setTemplates([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    const cancel = load();
    return cancel;
  }, [load]);

  return { templates, loading, error, reload: load };
}

/* ─────────────────────────────────────────────
   ACTION ROW
───────────────────────────────────────────── */

function ActionRow({
  config,
  templates,
  templatesLoading,
  templatesError,
  onReloadTemplates,
  onChange,
  onRemove,
  index,
}: {
  config: ActionConfig;
  templates: ApprovedTemplate[];
  templatesLoading: boolean;
  templatesError: string | null;
  onReloadTemplates: () => void;
  onChange: (updated: ActionConfig) => void;
  onRemove: () => void;
  index: number;
}) {
  const def = ACTION_DEFINITIONS.find((d) => d.type === config.type)!;
  const Icon = def.icon;

  return (
    <div className="relative rounded-xl border border-border/60 bg-card overflow-hidden transition-all duration-200 hover:border-border hover:shadow-sm">
      {/* Left accent bar */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1 rounded-l-xl",
          config.type === "whatsapp" && "bg-emerald-500",
          config.type === "email" && "bg-blue-500",
          config.type === "mark_due_soon" && "bg-amber-500",
          config.type === "escalate" && "bg-purple-500",
        )}
      />

      <div className="pl-5 pr-4 py-4 space-y-4">
        {/* Header row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className={cn("p-1.5 rounded-lg", def.bg)}>
              <Icon className={cn("h-3.5 w-3.5", def.color)} />
            </div>
            <span className={cn("font-semibold text-sm", def.color)}>
              {def.label}
            </span>
            <span className="text-[10px] font-bold text-muted-foreground/50 bg-muted rounded-full px-2 py-0.5">
              Step {index + 1}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            onClick={onRemove}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Template picker */}
        {def.needsTemplate && (
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Message Template{" "}
              <span className="text-destructive normal-case">*required</span>
            </label>

            {templatesLoading ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 rounded-xl px-3 py-2.5 border border-border/40">
                <Loader2 className="h-3.5 w-3.5 animate-spin flex-shrink-0" />
                Loading approved templates…
              </div>
            ) : templatesError ? (
              <div className="flex items-center justify-between gap-2 text-xs text-destructive bg-destructive/5 rounded-xl px-3 py-2.5 border border-destructive/20">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                  {templatesError}
                </div>
                <button
                  onClick={onReloadTemplates}
                  className="flex items-center gap-1 text-[11px] font-semibold hover:underline"
                >
                  <RefreshCw className="h-3 w-3" />
                  Retry
                </button>
              </div>
            ) : templates.length === 0 ? (
              <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-xl px-3 py-2.5 border border-amber-200 dark:border-amber-800">
                <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                No approved templates found. Approve a template first.
              </div>
            ) : (
              <Select
                value={config.template_id?.toString() ?? ""}
                onValueChange={(v) =>
                  onChange({ ...config, template_id: Number(v) })
                }
              >
                <SelectTrigger className="h-9 rounded-xl text-sm border-border/60">
                  <SelectValue placeholder="Select approved template…" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((t) => (
                    <SelectItem key={t.id} value={t.id.toString()}>
                      <span className="flex items-center gap-2">
                        <span className="font-medium">{t.name}</span>
                        <span className="text-[10px] text-muted-foreground capitalize">
                          ({t.category})
                        </span>
                        {t.variables.length > 0 && (
                          <span className="text-[10px] text-indigo-500 font-mono">
                            {t.variables.length} var
                            {t.variables.length !== 1 ? "s" : ""}
                          </span>
                        )}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}

        {/* Delay slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Delay After Record Creation
            </label>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-800">
              {config.delay_days} {config.delay_days === 1 ? "day" : "days"}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={365}
            value={config.delay_days}
            onChange={(e) =>
              onChange({ ...config, delay_days: Number(e.target.value) })
            }
            className="w-full accent-indigo-600 h-1.5"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground/60">
            <span>1 day</span>
            <span>1 month</span>
            <span>6 months</span>
            <span>1 year</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   AUTOMATION FORM
───────────────────────────────────────────── */

export function AutomationForm({
  onSave,
  onClose,
  saving,
  initial,
}: {
  onSave: (data: {
    name: string;
    service_type: ServiceType;
    trigger_type: string;
    conditions: { service_type: ServiceType };
    actions: ActionConfig[];
    enabled: boolean;
  }) => void;
  onClose: () => void;
  saving: boolean;
  initial?: Partial<AutomationRule>;
}) {
  const [name, setName] = React.useState(initial?.name ?? "");
  const [service, setService] = React.useState<ServiceType>(
    initial?.conditions?.service_type ?? "GST",
  );
  const [actions, setActions] = React.useState<ActionConfig[]>(
    initial?.actions ?? [],
  );
  const [pickerOpen, setPickerOpen] = React.useState(false);

  const {
    templates,
    loading: templatesLoading,
    error: templatesError,
    reload: reloadTemplates,
  } = useApprovedTemplates();

  const selectedTypes = new Set(actions.map((a) => a.type));
  const availableToAdd = ACTION_DEFINITIONS.filter(
    (d) => !selectedTypes.has(d.type),
  );

  const isValid =
    name.trim().length > 0 &&
    actions.length > 0 &&
    actions.every((a) => {
      const def = ACTION_DEFINITIONS.find((d) => d.type === a.type)!;
      return !def.needsTemplate || !!a.template_id;
    });

  function addAction(type: ActionType) {
    if (selectedTypes.has(type)) return;
    setActions((prev) => [...prev, { type, template_id: null, delay_days: 7 }]);
    setPickerOpen(false);
  }

  function updateAction(index: number, updated: ActionConfig) {
    setActions((prev) => prev.map((a, i) => (i === index ? updated : a)));
  }

  function removeAction(index: number) {
    setActions((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-5 py-1">
      {/* Rule name */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Rule Name <span className="text-destructive">*</span>
        </label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. GST Due Reminder Flow"
          className="rounded-xl h-9 border-border/60 focus:border-indigo-400"
        />
      </div>

      {/* Service type */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Trigger: When a record of type…
        </label>
        <Select
          value={service}
          onValueChange={(v) => setService(v as ServiceType)}
        >
          <SelectTrigger className="rounded-xl h-9 border-border/60">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SERVICE_TYPES.map((s) => (
              <SelectItem key={s} value={s}>
                <span
                  className={cn(
                    "font-bold text-xs px-1.5 py-0.5 rounded",
                    SERVICE_COLORS[s],
                  )}
                >
                  {s}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-[11px] text-muted-foreground">
          …is created, the actions below will fire after their configured delay.
        </p>
      </div>

      {/* Actions section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Actions{" "}
            <span className="text-muted-foreground/50 normal-case font-normal">
              ({actions.length} configured)
            </span>
          </label>
        </div>

        {actions.length === 0 && (
          <div className="rounded-xl border border-dashed border-border/60 py-10 flex flex-col items-center gap-2.5 text-muted-foreground/50">
            <div className="w-10 h-10 rounded-xl bg-muted/60 flex items-center justify-center">
              <Zap className="h-5 w-5" />
            </div>
            <p className="text-xs font-medium">
              No actions yet — add at least one below.
            </p>
          </div>
        )}

        <div className="space-y-2.5">
          {actions.map((action, idx) => (
            <ActionRow
              key={`${action.type}-${idx}`}
              config={action}
              index={idx}
              templates={templates}
              templatesLoading={templatesLoading}
              templatesError={templatesError}
              onReloadTemplates={reloadTemplates}
              onChange={(updated) => updateAction(idx, updated)}
              onRemove={() => removeAction(idx)}
            />
          ))}
        </div>

        {/* Add action picker */}
        {availableToAdd.length > 0 && (
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="w-full rounded-xl h-9 border-dashed gap-2 text-xs hover:border-indigo-300 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-colors"
              onClick={() => setPickerOpen((v) => !v)}
            >
              <Plus className="h-3.5 w-3.5" />
              Add Action
              {pickerOpen ? (
                <ChevronUp className="h-3.5 w-3.5 ml-auto" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 ml-auto" />
              )}
            </Button>

            {pickerOpen && (
              <div className="absolute z-10 mt-1 w-full rounded-xl border border-border bg-popover shadow-xl overflow-hidden">
                {availableToAdd.map((def) => {
                  const Icon = def.icon;
                  return (
                    <button
                      key={def.type}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted/60 transition-colors text-left group"
                      onClick={() => addAction(def.type)}
                    >
                      <div
                        className={cn(
                          "p-1.5 rounded-lg transition-colors",
                          def.bg,
                        )}
                      >
                        <Icon className={cn("h-3.5 w-3.5", def.color)} />
                      </div>
                      <span className="font-medium text-sm">{def.label}</span>
                      <Plus className="h-3.5 w-3.5 ml-auto text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rule Preview */}
      {actions.length > 0 && (
        <div className="rounded-xl border border-indigo-200 dark:border-indigo-800/60 bg-gradient-to-br from-indigo-50/80 to-blue-50/40 dark:from-indigo-950/40 dark:to-blue-950/20 p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Rule Preview
            </p>
          </div>
          <div className="space-y-1.5">
            {actions.map((a, i) => {
              const def = ACTION_DEFINITIONS.find((d) => d.type === a.type)!;
              const tpl = templates.find((t) => t.id === a.template_id);
              return (
                <div
                  key={i}
                  className="flex items-center gap-1.5 text-[12px] text-indigo-700 dark:text-indigo-300"
                >
                  <ArrowRight className="h-3 w-3 opacity-40 flex-shrink-0" />
                  <span className="font-semibold">{def.label}</span>
                  {tpl && (
                    <span className="text-indigo-500 dark:text-indigo-400">
                      {" "}
                      using{" "}
                      <em className="not-italic font-mono text-[11px] bg-indigo-100 dark:bg-indigo-900/40 px-1 rounded">
                        {tpl.name}
                      </em>
                    </span>
                  )}
                  <span className="text-indigo-400 dark:text-indigo-500">
                    {" "}
                    — after{" "}
                  </span>
                  <span className="font-bold">{a.delay_days}d</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Buttons */}
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
              name,
              service_type: service,
              trigger_type: "record_created",
              conditions: {
                service_type: service,
              },
              actions, // ✅ DO NOT MODIFY HERE
              enabled: true,
            })
          }
          disabled={saving || !isValid}
          className="flex-1 rounded-xl h-9 bg-indigo-600 hover:bg-indigo-700 shadow-md disabled:opacity-40"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          {initial ? "Save Changes" : "Create Rule"}
        </Button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   RULE CARD
───────────────────────────────────────────── */

function RuleCard({
  rule,
  onToggle,
  onDelete,
  onEdit,
  deleting,
  toggling,
}: {
  rule: AutomationRule;
  onToggle: (rule: AutomationRule) => void;
  onDelete: (id: number) => void;
  onEdit: (rule: AutomationRule) => void;
  deleting: number | null;
  toggling: number | null;
}) {
  return (
    <div
      className={cn(
        "group relative flex items-start gap-4 p-5 rounded-2xl border transition-all duration-200",
        rule.enabled
          ? "border-border/60 bg-card hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md hover:-translate-y-px"
          : "border-border/40 bg-muted/20 opacity-60",
      )}
    >
      {/* Status dot */}
      <div className="flex-shrink-0 mt-1.5">
        <div
          className={cn(
            "w-2 h-2 rounded-full transition-all duration-300",
            rule.enabled
              ? "bg-emerald-500 shadow-[0_0_6px_1px_rgba(16,185,129,0.4)]"
              : "bg-muted-foreground/30",
          )}
        />
      </div>

      <div className="flex-1 min-w-0 space-y-3">
        {/* Title + service badge */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-sm leading-none">{rule.name}</span>
          <span
            className={cn(
              "inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest",
              SERVICE_COLORS[rule.conditions.service_type],
            )}
          >
            {rule.conditions.service_type}
          </span>
        </div>

        {/* Actions */}
        <div className="space-y-1">
          {rule.actions.map((action, i) => {
            const def = ACTION_DEFINITIONS.find((d) => d.type === action.type);
            if (!def) return null;
            const Icon = def.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <ArrowRight className="h-3 w-3 opacity-30 flex-shrink-0" />
                <div className={cn("p-0.5 rounded", def.bg)}>
                  <Icon className={cn("h-3 w-3", def.color)} />
                </div>
                <span className="font-medium">{def.label}</span>
                {action.template_id && (
                  <span className="text-[10px] bg-muted rounded px-1.5 py-0.5 font-mono border border-border/40">
                    tpl #{action.template_id}
                  </span>
                )}
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground/60 ml-1">
                  <Clock className="h-2.5 w-2.5" />
                  {action.delay_days}d
                </span>
              </div>
            );
          })}
        </div>

        {/* Meta */}
        {(rule.created_at || rule.trigger_count !== undefined) && (
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground/60">
            {rule.created_at && (
              <span>
                Created{" "}
                {new Date(rule.created_at).toLocaleDateString(undefined, {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            )}
            {rule.trigger_count !== undefined && (
              <span className="flex items-center gap-1">
                <Activity className="h-2.5 w-2.5" />
                Triggered{" "}
                <strong className="text-muted-foreground">
                  {rule.trigger_count}×
                </strong>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
          onClick={() => onEdit(rule)}
        >
          Edit
        </Button>

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
   SKELETON LOADER
───────────────────────────────────────────── */

function RuleSkeleton() {
  return (
    <div className="flex items-start gap-4 p-5 rounded-2xl border border-border/40 bg-card animate-pulse">
      <div className="w-2 h-2 rounded-full bg-muted-foreground/20 mt-1.5 flex-shrink-0" />
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-4 w-40 bg-muted rounded-md" />
          <div className="h-4 w-12 bg-muted rounded-md" />
        </div>
        <div className="space-y-1.5">
          <div className="h-3 w-56 bg-muted rounded" />
          <div className="h-3 w-44 bg-muted rounded" />
        </div>
        <div className="h-3 w-32 bg-muted rounded" />
      </div>
      <div className="flex items-center gap-2">
        <div className="h-6 w-9 bg-muted rounded-full" />
        <div className="h-8 w-8 bg-muted rounded-xl" />
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
  const [editingRule, setEditingRule] = React.useState<AutomationRule | null>(
    null,
  );
  const [filterService, setFilterService] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  const fetchRules = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<{ success: boolean; data: unknown }>(
        "/api/v1/automation",
      );
      const raw =
        (res as any)?.data?.data ?? (res as any)?.data ?? (res as any) ?? [];
      setRules(Array.isArray(raw) ? (raw as AutomationRule[]) : []);
    } catch {
      setRules([]);
      toast({ title: "Failed to load rules", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  const handleCreate = async (data: {
    name: string;
    service_type: ServiceType;
    trigger_type: string;
    conditions: { service_type: ServiceType };
    actions: ActionConfig[];
    enabled: boolean;
  }) => {
    setSaving(true);
    try {
      // ✅ validation
      if (!data.actions.length) {
        toast({ title: "Add at least one action", variant: "destructive" });
        return;
      }

      if (!data.actions.every((a) => a.template_id)) {
        toast({
          title: "Please select template for all actions",
          variant: "destructive",
        });
        return;
      }

      // ✅ payload
      const payload = {
        name: data.name,
        trigger_type: "contact_created",
        conditions: {
          service_type: data.conditions.service_type,
        },
        actions: data.actions.map((a: ActionConfig) => ({
          type: "send_whatsapp",
          template_id: Number(a.template_id),
          delay_days: Number(a.delay_days || 1),
        })),
        is_active: data.enabled,
      };

      console.log("FINAL PAYLOAD:", payload);

      await api.post("/api/v1/automation", payload);

      toast({ title: "Automation rule created 🚀" });
      setCreateOpen(false);
      fetchRules();
    } catch (err: any) {
      console.error("CREATE ERROR:", err?.response?.data || err);
      toast({
        title: err?.response?.data?.error || "Error creating rule",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  const handleUpdate = async (
    data: Omit<AutomationRule, "id" | "created_at" | "trigger_count">,
  ) => {
    if (!editingRule) return;
    setSaving(true);
    try {
      await api.put(`/api/v1/automation/${editingRule.id}`, data);
      toast({ title: "Rule updated" });
      setEditingRule(null);
      fetchRules();
    } catch {
      toast({ title: "Error updating rule", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

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

  const handleToggle = async (rule: AutomationRule) => {
    setToggling(rule.id);
    const updated = { ...rule, enabled: !rule.enabled };
    // Optimistic update
    setRules((prev) => prev.map((r) => (r.id === rule.id ? updated : r)));
    try {
      await api.put(`/api/v1/automation/${rule.id}`, {
        enabled: updated.enabled,
      });
    } catch {
      // Rollback on failure
      setRules((prev) => prev.map((r) => (r.id === rule.id ? rule : r)));
      toast({ title: "Failed to update rule", variant: "destructive" });
    } finally {
      setToggling(null);
    }
  };

  const filtered = React.useMemo(() => {
    let result = rules;
    if (filterService !== "all") {
      result = result.filter(
        (r) => r.conditions?.service_type === filterService,
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((r) => r.name.toLowerCase().includes(q));
    }
    return result;
  }, [rules, filterService, searchQuery]);

  const counts = React.useMemo(
    () => ({
      total: rules.length,
      active: rules.filter((r) => r.enabled).length,
      inactive: rules.filter((r) => !r.enabled).length,
    }),
    [rules],
  );

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
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
              <Zap className="h-4 w-4" />
            </span>
            Automation Rules
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Multi-action automation. Each rule can trigger WhatsApp, email, and
            more — independently timed.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-xl gap-1.5 text-xs"
            onClick={fetchRules}
            disabled={loading}
          >
            <RefreshCw
              className={cn("h-3.5 w-3.5", loading && "animate-spin")}
            />
            Refresh
          </Button>

          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 h-9">
                <Plus className="h-4 w-4" />
                New Rule
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
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
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "Total Rules",
            value: counts.total,
            icon: Layers,
            cls: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
            trend: null,
          },
          {
            label: "Active",
            value: counts.active,
            icon: CheckCircle2,
            cls: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
            trend:
              counts.total > 0
                ? Math.round((counts.active / counts.total) * 100)
                : 0,
          },
          {
            label: "Paused",
            value: counts.inactive,
            icon: Circle,
            cls: "bg-slate-50 text-slate-500 dark:bg-slate-800/30 dark:text-slate-400",
            trend: null,
          },
        ].map((s) => (
          <Card
            key={s.label}
            className="p-4 rounded-2xl border border-border/60 shadow-sm flex items-center gap-3"
          >
            <div className={cn("p-2 rounded-xl flex-shrink-0", s.cls)}>
              <s.icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-baseline gap-1.5">
                <p className="text-xl font-bold tracking-tight">{s.value}</p>
                {s.trend !== null && (
                  <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5">
                    <TrendingUp className="h-2.5 w-2.5" />
                    {s.trend}%
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground font-medium truncate">
                {s.label}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* ── Info banner ── */}
      <div className="rounded-xl border border-indigo-200 dark:border-indigo-800/50 bg-gradient-to-r from-indigo-50/80 to-blue-50/40 dark:from-indigo-950/40 dark:to-blue-950/20 px-5 py-4">
        <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2">
          How Multi-Action Automation Works
        </p>
        <div className="flex items-center gap-2 flex-wrap text-xs text-indigo-700 dark:text-indigo-300">
          {[
            "Record Created",
            "Match Rule Conditions",
            "Schedule Each Action",
            "Worker Executes ✅",
          ].map((step, i, arr) => (
            <React.Fragment key={step}>
              <span className="font-semibold">{step}</span>
              {i < arr.length - 1 && (
                <ArrowRight className="h-3 w-3 opacity-40" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── Filter + Search ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50 pointer-events-none" />
          <input
            type="text"
            placeholder="Search rules…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-48 rounded-xl border border-border/60 bg-background pl-8 pr-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 transition-colors"
          />
        </div>

        <Select value={filterService} onValueChange={setFilterService}>
          <SelectTrigger className="w-[150px] h-9 rounded-xl text-sm border-border/60">
            <SelectValue placeholder="All services" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All services</SelectItem>
            {SERVICE_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                <span
                  className={cn(
                    "font-bold text-[10px] px-1 py-0.5 rounded",
                    SERVICE_COLORS[t],
                  )}
                >
                  {t}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {(filterService !== "all" || searchQuery) && (
          <Button
            variant="ghost"
            size="sm"
            className="h-9 rounded-xl text-xs text-muted-foreground"
            onClick={() => {
              setFilterService("all");
              setSearchQuery("");
            }}
          >
            Clear filters
          </Button>
        )}

        <span className="ml-auto text-xs text-muted-foreground">
          {filtered.length} rule{filtered.length !== 1 ? "s" : ""}
          {filtered.length !== rules.length && ` of ${rules.length}`}
        </span>
      </div>

      {/* ── Rules list ── */}
      {loading ? (
        <div className="space-y-2.5">
          {[1, 2, 3].map((i) => (
            <RuleSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
            <Zap className="h-6 w-6 text-muted-foreground/30" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-muted-foreground">
              {rules.length === 0
                ? "No automation rules yet"
                : "No rules match your filters"}
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              {rules.length === 0
                ? "Create your first rule to start automating reminders"
                : "Try adjusting the search or filter"}
            </p>
          </div>
          {rules.length === 0 && (
            <Button
              size="sm"
              className="rounded-xl mt-1 bg-indigo-600 hover:bg-indigo-700 shadow-md"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Create First Rule
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
              onEdit={setEditingRule}
              deleting={deleting}
              toggling={toggling}
            />
          ))}
        </div>
      )}

      {/* ── Edit dialog ── */}
      {editingRule && (
        <Dialog
          open={!!editingRule}
          onOpenChange={(v) => !v && setEditingRule(null)}
        >
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Rule</DialogTitle>
            </DialogHeader>
            <AutomationForm
              initial={editingRule}
              onSave={handleUpdate}
              onClose={() => setEditingRule(null)}
              saving={saving}
            />
          </DialogContent>
        </Dialog>
      )}

      {!loading && rules.length > 0 && (
        <p className="text-[11px] text-muted-foreground/60 text-center pt-2">
          Toggle the switch to pause/resume any rule without deleting it.
        </p>
      )}
    </div>
  );
}
