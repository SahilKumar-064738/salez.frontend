import * as React from "react";
import type { Template } from "@/services/templatesService";
import { useTemplates, useCreateTemplate, useUpdateTemplate } from "@/hooks/use-templates";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Search, Sparkles, Copy, Edit2, CheckCircle2, Clock, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

function useDebounced<T>(value: T, delay = 250) {
  const [v, setV] = React.useState(value);
  React.useEffect(() => {
    const t = window.setTimeout(() => setV(value), delay);
    return () => window.clearTimeout(t);
  }, [value, delay]);
  return v;
}

const statuses = ["Pending", "Approved", "Rejected"] as const;

const DEMO_TEMPLATES = [
  { id: "demo-1", name: "Welcome New Lead", status: "Approved", category: "utility", content: "Hi {{name}}! 👋 Welcome to {{business}}. We're thrilled to connect with you on WhatsApp. How can we help you today?", variables: ["name", "business"] },
  { id: "demo-2", name: "Appointment Reminder", status: "Approved", category: "utility", content: "Hi {{name}}, this is a reminder that your appointment is scheduled for {{date}} at {{time}}. Reply YES to confirm or NO to reschedule.", variables: ["name", "date", "time"] },
  { id: "demo-3", name: "Follow-up Nudge", status: "Approved", category: "marketing", content: "Hey {{name}}! Just checking in — did you get a chance to look at our proposal? We'd love to answer any questions. 😊", variables: ["name"] },
  { id: "demo-4", name: "Flash Sale Alert", status: "Pending", category: "marketing", content: "🔥 {{name}}, our biggest sale of the year starts NOW! Get {{discount}}% off on all plans. Offer ends {{date}}. Tap to grab yours!", variables: ["name", "discount", "date"] },
  { id: "demo-5", name: "Order Confirmation", status: "Approved", category: "utility", content: "Hi {{name}} ✅ Your order #{{order_id}} has been confirmed. Expected delivery: {{delivery_date}}. Track: {{tracking_link}}", variables: ["name", "order_id", "delivery_date", "tracking_link"] },
  { id: "demo-6", name: "Win-Back Campaign", status: "Rejected", category: "marketing", content: "We miss you, {{name}}! 💙 It's been a while. Come back and get {{offer}} just for you. Valid till {{expiry}}.", variables: ["name", "offer", "expiry"] },
];

function StatusBadge({ status }: { status: string }) {
  const s = status?.toLowerCase();
  if (s === "approved") return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2.5 py-0.5 text-[11px] font-semibold">
      <CheckCircle2 className="h-3 w-3" /> Approved
    </span>
  );
  if (s === "rejected") return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2.5 py-0.5 text-[11px] font-semibold">
      <XCircle className="h-3 w-3" /> Rejected
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2.5 py-0.5 text-[11px] font-semibold">
      <Clock className="h-3 w-3" /> Pending
    </span>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const colors: Record<string, string> = {
    utility: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
    marketing: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
    authentication: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
  };
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize", colors[category] || colors.utility)}>
      {category}
    </span>
  );
}

function TemplateEditor({ initial, saving, locked, onSave }: {
  initial?: Partial<Template>; saving?: boolean; locked?: boolean;
  onSave: (data: Partial<Template>) => void;
}) {
  const [name, setName] = React.useState(initial?.name ?? "");
  const [content, setContent] = React.useState(initial?.content ?? "");
  const [category, setCategory] = React.useState((initial as any)?.category ?? "utility");

  const variables = React.useMemo(() => {
    const matches = content.match(/\{\{([^}]+)\}\}/g) || [];
    return [...new Set(matches.map(m => m.replace(/\{\{|\}\}/g, "")))];
  }, [content]);

  return (
    <div className="space-y-4 py-2">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-muted-foreground">Template Name *</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Welcome Message" className="mt-1" disabled={locked} />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground">Category</label>
          <Select value={category} onValueChange={setCategory} disabled={locked}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="utility">Utility</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="authentication">Authentication</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold text-muted-foreground">Content *</label>
        <Textarea value={content} onChange={(e) => setContent(e.target.value)}
          placeholder="Hi {{name}}, your appointment is on {{date}} at {{time}}."
          className="mt-1 min-h-[140px] font-mono text-sm" disabled={locked} />
        <p className="text-[11px] text-muted-foreground mt-1">Use {"{{variable}}"} for dynamic fields.</p>
      </div>
      {variables.length > 0 && (
        <div className="rounded-xl bg-muted/50 p-3">
          <p className="text-xs font-semibold mb-2">Detected variables:</p>
          <div className="flex flex-wrap gap-1.5">
            {variables.map(v => <code key={v} className="text-[11px] bg-background border rounded px-2 py-0.5">{`{{${v}}}`}</code>)}
          </div>
        </div>
      )}
      {locked && (
        <p className="text-xs text-muted-foreground bg-muted/50 rounded-xl p-3">
          ✅ This template is <strong>Approved</strong> — content is locked. Duplicate it to create an editable copy.
        </p>
      )}
      <Button onClick={() => onSave({ name, content, variables, category } as any)}
        disabled={saving || !name.trim() || !content.trim() || locked} className="w-full rounded-xl">
        {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
        {initial ? "Save Changes" : "Create Template"}
      </Button>
    </div>
  );
}

function TemplateCard({ t, isDemo, onEdit, onCopy }: {
  t: any; isDemo: boolean;
  onEdit: (t: any) => void;
  onCopy: (t: any) => void;
}) {
  return (
    <div className="p-5 rounded-2xl border border-border bg-card shadow-sm hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-3.5 group">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm truncate leading-tight">{t.name}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <StatusBadge status={t.status} />
            <CategoryBadge category={t.category ?? "utility"} />
          </div>
        </div>
        {isDemo && (
          <span className="text-[10px] bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-full px-2 py-0.5 font-semibold shrink-0">Demo</span>
        )}
      </div>

      <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed bg-muted/30 rounded-xl p-3 border border-border/40">
        {t.content}
      </p>

      {(t.variables || []).length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">Variables:</span>
          {(t.variables || []).slice(0, 4).map((v: string) => (
            <code key={v} className="text-[10px] bg-primary/10 text-primary rounded-lg px-2 py-0.5 font-mono font-semibold">{`{{${v}}}`}</code>
          ))}
          {(t.variables || []).length > 4 && <span className="text-[10px] text-muted-foreground">+{t.variables.length - 4} more</span>}
        </div>
      )}

      {!isDemo && (
        <div className="flex items-center gap-2 pt-2 border-t border-border/50 mt-auto">
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs flex-1 rounded-xl hover:bg-muted/80 transition-colors" onClick={() => onEdit(t)}>
            <Edit2 className="h-3.5 w-3.5" /> Edit
          </Button>
          <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs flex-1 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => onCopy(t)}>
            <Copy className="h-3.5 w-3.5" /> Duplicate
          </Button>
        </div>
      )}
    </div>
  );
}

export default function TemplatesPage() {
  const { toast } = useToast();
  const [search, setSearch] = React.useState("");
  const debounced = useDebounced(search);
  const [status, setStatus] = React.useState<string>("all");
  const [creating, setCreating] = React.useState(false);
  const [editing, setEditing] = React.useState<Template | null>(null);

  const q = useTemplates({ search: debounced || undefined, status: status === "all" ? undefined : status });
  const createM = useCreateTemplate();
  const updateM = useUpdateTemplate();

  const templates = (q.data || []) as unknown as Template[];
  const isDemo = !q.isLoading && templates.length === 0;
  const displayTemplates = isDemo ? DEMO_TEMPLATES : templates;

  const handleCopy = (t: any) => {
    createM.mutate({ name: `${t.name} (copy)`, content: t.content, variables: t.variables, status: "Pending" } as any, {
      onSuccess: () => toast({ title: "Duplicated" }),
      onError: (e) => toast({ title: "Failed", description: String((e as any)?.message || e), variant: "destructive" }),
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-5" data-testid="page-templates">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Templates</h1>
          <p className="text-sm text-muted-foreground mt-0.5">WhatsApp message templates. Approved templates are locked for editing.</p>
        </div>
        <Dialog open={creating} onOpenChange={setCreating}>
          <DialogTrigger asChild>
            <Button className="gap-2 rounded-xl bg-green-600 hover:bg-green-700 shadow-md hover:scale-105 transition-all" data-testid="templates-create-open">
              <Plus className="h-4 w-4" /> New Template
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>Create Template</DialogTitle></DialogHeader>
            <TemplateEditor saving={createM.isPending}
              onSave={(data) => createM.mutate(data as any, {
                onSuccess: () => { toast({ title: "Template created" }); setCreating(false); },
                onError: (e) => toast({ title: "Failed", description: String((e as any)?.message || e), variant: "destructive" }),
              })} />
          </DialogContent>
        </Dialog>
      </div>

      {isDemo && (
        <div className="rounded-2xl border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-900/20 px-5 py-4 flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-violet-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-violet-800 dark:text-violet-300">✨ Demo Templates — Pre-filled examples</p>
            <p className="text-xs text-violet-700 dark:text-violet-400 mt-0.5">
              No templates yet. Showing 6 ready-to-use examples. Click "New Template" to create your first real template.
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[160px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search templates…" className="pl-8 h-9 text-sm rounded-xl" />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[150px] h-9 text-sm rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={() => q.refetch()} className="rounded-xl h-9">Refresh</Button>
        {isDemo && <Badge variant="secondary" className="text-[10px]">Demo Data</Badge>}
      </div>

      {/* Card Grid */}
      {q.isLoading ? (
        <div className="p-8 text-center"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground mx-auto" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(displayTemplates as any[]).map((t: any) => (
            <TemplateCard key={t.id} t={t} isDemo={isDemo} onEdit={setEditing} onCopy={handleCopy} />
          ))}
        </div>
      )}

      {/* Edit dialog */}
      {editing && (
        <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>Edit Template</DialogTitle></DialogHeader>
            <TemplateEditor initial={editing} locked={(editing as any).status === "Approved"}
              saving={updateM.isPending}
              onSave={(data) => updateM.mutate({ id: (editing as any).id, updates: data as any }, {
                onSuccess: () => { toast({ title: "Saved" }); setEditing(null); },
                onError: (e) => toast({ title: "Failed", description: String((e as any)?.message || e), variant: "destructive" }),
              })} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
