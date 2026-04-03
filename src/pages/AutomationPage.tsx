import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */

type ServiceType = "GST" | "ITR" | "TDS" | "ROC" | "Other";

type ActionType = "whatsapp" | "email" | "mark_due_soon" | "escalate";

interface ActionConfig {
  type: ActionType;
  template_id?: number | null; // only for whatsapp / email
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
}[] = [
  {
    type: "whatsapp",
    label: "Send WhatsApp Reminder",
    icon: MessageSquare,
    needsTemplate: true,
    color: "text-emerald-600",
  },
  {
    type: "email",
    label: "Send Email Reminder",
    icon: Mail,
    needsTemplate: true,
    color: "text-blue-600",
  },
  {
    type: "mark_due_soon",
    label: "Mark as Due Soon",
    icon: Clock,
    needsTemplate: false,
    color: "text-amber-600",
  },
  {
    type: "escalate",
    label: "Escalate to Senior CA",
    icon: Settings2,
    needsTemplate: false,
    color: "text-purple-600",
  },
];

const SERVICE_COLORS: Record<ServiceType, string> = {
  GST: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  ITR: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  TDS: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  ROC: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  Other: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

/* ─────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────── */

function useApprovedTemplates() {
  const [templates, setTemplates] = React.useState<ApprovedTemplate[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setLoading(true);
    api
      .get<{ data: ApprovedTemplate[] }>("/api/v1/templates?status=approved")
      .then((res) => {
        const data = (res as any)?.data || res || [];
        setTemplates(Array.isArray(data) ? data : []);
      })
      .catch(() => setError("Failed to load templates"))
      .finally(() => setLoading(false));
  }, []);

  return { templates, loading, error };
}

/* ─────────────────────────────────────────────
   ACTION ROW — one configured action block
───────────────────────────────────────────── */

function ActionRow({
  config,
  templates,
  templatesLoading,
  onChange,
  onRemove,
}: {
  config: ActionConfig;
  templates: ApprovedTemplate[];
  templatesLoading: boolean;
  onChange: (updated: ActionConfig) => void;
  onRemove: () => void;
}) {
  const def = ACTION_DEFINITIONS.find((d) => d.type === config.type)!;
  const Icon = def.icon;

  return (
    <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div
          className={cn(
            "flex items-center gap-2 font-semibold text-sm",
            def.color,
          )}
        >
          <Icon className="h-4 w-4" />
          {def.label}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={onRemove}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Template picker — only for whatsapp / email */}
      {def.needsTemplate && (
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Message Template <span className="text-destructive">*</span>
          </label>
          {templatesLoading ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Loading approved templates…
            </div>
          ) : templates.length === 0 ? (
            <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3 py-2">
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
              <SelectTrigger className="h-9 rounded-xl text-sm">
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
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      {/* Per-action delay */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex justify-between">
          <span>Delay After Record Creation</span>
          <span className="text-indigo-600 font-bold">
            {config.delay_days} days
          </span>
        </label>
        <input
          type="range"
          min={1}
          max={365}
          value={config.delay_days}
          onChange={(e) =>
            onChange({ ...config, delay_days: Number(e.target.value) })
          }
          className="w-full accent-indigo-600"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>1 day</span>
          <span>365 days</span>
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

  const { templates, loading: templatesLoading } = useApprovedTemplates();

  /* Derive which action types are already selected */
  const selectedTypes = new Set(actions.map((a) => a.type));

  /* Validation: every template-needing action must have a template_id */
  const isValid =
    name.trim().length > 0 &&
    actions.length > 0 &&
    actions.every((a) => {
      const def = ACTION_DEFINITIONS.find((d) => d.type === a.type)!;
      return !def.needsTemplate || !!a.template_id;
    });

  function addAction(type: ActionType) {
    if (selectedTypes.has(type)) return; // no duplicates
    setActions((prev) => [...prev, { type, template_id: null, delay_days: 7 }]);
    setPickerOpen(false);
  }

  function updateAction(index: number, updated: ActionConfig) {
    setActions((prev) => prev.map((a, i) => (i === index ? updated : a)));
  }

  function removeAction(index: number) {
    setActions((prev) => prev.filter((_, i) => i !== index));
  }

  const availableToAdd = ACTION_DEFINITIONS.filter(
    (d) => !selectedTypes.has(d.type),
  );

  return (
    <div className="space-y-5 py-2">
      {/* Rule name */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Rule Name <span className="text-destructive">*</span>
        </label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. GST Due Reminder Flow"
          className="rounded-xl h-9"
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
          <SelectTrigger className="rounded-xl h-9">
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
            <span className="text-muted-foreground/60 normal-case">
              ({actions.length} selected)
            </span>
          </label>
        </div>

        {/* Existing action rows */}
        {actions.length === 0 && (
          <div className="rounded-xl border border-dashed border-border/60 py-8 flex flex-col items-center gap-2 text-muted-foreground/60">
            <Zap className="h-6 w-6" />
            <p className="text-xs">No actions yet. Add at least one below.</p>
          </div>
        )}

        <div className="space-y-3">
          {actions.map((action, idx) => (
            <ActionRow
              key={`${action.type}-${idx}`}
              config={action}
              templates={templates}
              templatesLoading={templatesLoading}
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
              className="w-full rounded-xl h-9 border-dashed gap-2 text-xs"
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
              <div className="absolute z-10 mt-1 w-full rounded-xl border border-border bg-popover shadow-lg overflow-hidden">
                {availableToAdd.map((def) => {
                  const Icon = def.icon;
                  return (
                    <button
                      key={def.type}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted/60 transition-colors text-left"
                      onClick={() => addAction(def.type)}
                    >
                      <Icon className={cn("h-4 w-4", def.color)} />
                      {def.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Preview */}
      {actions.length > 0 && (
        <div className="rounded-xl border border-dashed border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30 p-3 space-y-1.5">
          <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
            Rule Preview
          </p>
          {actions.map((a, i) => {
            const def = ACTION_DEFINITIONS.find((d) => d.type === a.type)!;
            const tpl = templates.find((t) => t.id === a.template_id);
            return (
              <div
                key={i}
                className="flex items-center gap-1.5 text-[12px] text-indigo-700 dark:text-indigo-300"
              >
                <ArrowRight className="h-3 w-3 opacity-50" />
                <strong>{def.label}</strong>
                {tpl && (
                  <>
                    {" "}
                    using <em>"{tpl.name}"</em>
                  </>
                )}
                {" — "}after <strong>{a.delay_days} days</strong>
              </div>
            );
          })}
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
              conditions: { service_type: service },
              actions,
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
          {initial ? "Save Changes" : "Create Rule"}
        </Button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   RULE CARD  (updated to show multi-actions)
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
          ? "border-border/60 bg-card hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-sm"
          : "border-border/40 bg-muted/30 opacity-60",
      )}
    >
      <div className="flex-shrink-0 mt-1">
        <div
          className={cn(
            "w-2 h-2 rounded-full transition-colors",
            rule.enabled
              ? "bg-emerald-500 shadow-sm shadow-emerald-500/50"
              : "bg-muted-foreground/30",
          )}
        />
      </div>

      <div className="flex-1 min-w-0 space-y-2.5">
        {/* Title + service */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-sm">{rule.name}</span>
          <span
            className={cn(
              "inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest",
              SERVICE_COLORS[rule.conditions.service_type],
            )}
          >
            {rule.conditions.service_type}
          </span>
        </div>

        {/* Actions list */}
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
                <ArrowRight className="h-3 w-3 opacity-40 flex-shrink-0" />
                <Icon className={cn("h-3.5 w-3.5", def.color)} />
                <span>{def.label}</span>
                {action.template_id && (
                  <span className="text-[10px] bg-muted rounded px-1.5 py-0.5 font-mono">
                    template #{action.template_id}
                  </span>
                )}
                <Clock className="h-3 w-3 ml-1 opacity-40" />
                <span>{action.delay_days}d</span>
              </div>
            );
          })}
        </div>

        {/* Meta */}
        {rule.created_at && (
          <p className="text-[10px] text-muted-foreground">
            Created{" "}
            {new Date(rule.created_at).toLocaleDateString(undefined, {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
            {rule.trigger_count !== undefined && (
              <>
                {" "}
                · Triggered <strong>{rule.trigger_count}×</strong>
              </>
            )}
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity"
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
    setRules((prev) => prev.map((r) => (r.id === rule.id ? updated : r)));
    try {
      await api.put(`/api/v1/automation/${rule.id}`, {
        enabled: updated.enabled,
      });
    } catch {
      setRules((prev) => prev.map((r) => (r.id === rule.id ? rule : r)));
      toast({ title: "Failed to update rule", variant: "destructive" });
    } finally {
      setToggling(null);
    }
  };

  const filtered = React.useMemo(
    () =>
      filterService === "all"
        ? rules
        : rules.filter((r) => r.conditions?.service_type === filterService),
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

  return (
    <div
      className="max-w-[900px] mx-auto px-6 py-8 space-y-6"
      data-testid="page-automation"
    >
      {/* Header */}
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
            Multi-action automation. Each rule can trigger WhatsApp, email, and
            more — independently timed.
          </p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-md h-9">
              <Plus className="h-4 w-4" /> New Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
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

      {/* Stats */}
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

      {/* Info banner */}
      <div className="rounded-xl border border-indigo-200 dark:border-indigo-800/50 bg-indigo-50/60 dark:bg-indigo-950/30 px-5 py-4">
        <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2">
          How Multi-Action Automation Works
        </p>
        <div className="flex items-center gap-2 flex-wrap text-xs text-indigo-700 dark:text-indigo-300">
          <span className="font-medium">Record Created</span>
          <ArrowRight className="h-3 w-3 opacity-60" />
          <span className="font-medium">Match Rule Conditions</span>
          <ArrowRight className="h-3 w-3 opacity-60" />
          <span className="font-medium">Schedule Each Action</span>
          <ArrowRight className="h-3 w-3 opacity-60" />
          <span className="font-medium">Worker Executes ✅</span>
        </div>
      </div>

      {/* Filter */}
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
            className="h-9 rounded-xl text-xs"
            onClick={() => setFilterService("all")}
          >
            Clear
          </Button>
        )}
        <span className="ml-auto text-xs text-muted-foreground">
          {filtered.length} rule{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Rules list */}
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
                : "Try a different filter"}
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
              onEdit={setEditingRule}
              deleting={deleting}
              toggling={toggling}
            />
          ))}
        </div>
      )}

      {/* Edit dialog */}
      {editingRule && (
        <Dialog
          open={!!editingRule}
          onOpenChange={(v) => !v && setEditingRule(null)}
        >
          <DialogContent className="sm:max-w-lg">
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
        <p className="text-[11px] text-muted-foreground text-center pt-2">
          Toggle the switch to pause/resume any rule without deleting it.
        </p>
      )}
    </div>
  );
}
