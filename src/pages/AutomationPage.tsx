import * as React from "react";
import type { AutomationRule } from "@shared/schema";
import { useAutomationRules, useCreateAutomationRule, useUpdateAutomationRule } from "@/hooks/use-automation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Plus, Sparkles, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function ruleSummary(r: Partial<AutomationRule>) {
  const t = r.triggerType ? `${r.triggerType}${r.triggerValue ? `(${r.triggerValue})` : ""}` : "—";
  const c = r.conditionType ? `${r.conditionType}${r.conditionValue ? `(${r.conditionValue})` : ""}` : "Any";
  const a = r.actionType ? `${r.actionType}${r.actionValue ? `(${r.actionValue})` : ""}` : "—";
  return `When ${t} and ${c}, do ${a}.`;
}

function RuleEditor({
  initial,
  saving,
  onSave,
}: {
  initial?: Partial<AutomationRule>;
  saving?: boolean;
  onSave: (data: Partial<AutomationRule>) => void;
}) {
  const [name, setName] = React.useState(initial?.name ?? "");
  const [enabled, setEnabled] = React.useState(initial?.enabled ?? true);
  const [triggerType, setTriggerType] = React.useState(initial?.triggerType ?? "contact.stage.changed");
  const [triggerValue, setTriggerValue] = React.useState(initial?.triggerValue ?? "");
  const [conditionType, setConditionType] = React.useState(initial?.conditionType ?? "");
  const [conditionValue, setConditionValue] = React.useState(initial?.conditionValue ?? "");
  const [actionType, setActionType] = React.useState(initial?.actionType ?? "send.template");
  const [actionValue, setActionValue] = React.useState(initial?.actionValue ?? "");

  const draft: Partial<AutomationRule> = {
    name,
    enabled,
    triggerType,
    triggerValue: triggerValue || null,
    conditionType: conditionType || null,
    conditionValue: conditionValue || null,
    actionType,
    actionValue: actionValue || null,
  } as any;

  return (
    <div className="space-y-4" data-testid="automation-editor">
      <div className="rounded-2xl border border-card-border bg-gradient-to-br from-primary/10 to-accent/10 p-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          Live summary
        </div>
        <div className="mt-2 text-sm leading-relaxed">{ruleSummary(draft)}</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-muted-foreground">Rule name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 rounded-xl focus-ring"
            placeholder="Auto-follow-up for Engaged leads"
            data-testid="automation-name"
          />
        </div>

        <div className="sm:col-span-2 flex items-center justify-between rounded-2xl border border-card-border bg-background/40 px-4 py-3">
          <div>
            <div className="text-sm font-semibold">Enabled</div>
            <div className="text-xs text-muted-foreground">Turn rule on/off without deleting.</div>
          </div>
          <Switch checked={enabled} onCheckedChange={setEnabled} data-testid="automation-enabled" />
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground">Trigger type</label>
          <Input
            value={triggerType}
            onChange={(e) => setTriggerType(e.target.value)}
            className="mt-1 rounded-xl focus-ring"
            placeholder="contact.stage.changed"
            data-testid="automation-triggerType"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground">Trigger value</label>
          <Input
            value={triggerValue}
            onChange={(e) => setTriggerValue(e.target.value)}
            className="mt-1 rounded-xl focus-ring"
            placeholder="Interested"
            data-testid="automation-triggerValue"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground">Condition type</label>
          <Input
            value={conditionType}
            onChange={(e) => setConditionType(e.target.value)}
            className="mt-1 rounded-xl focus-ring"
            placeholder="tag.includes"
            data-testid="automation-conditionType"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground">Condition value</label>
          <Input
            value={conditionValue}
            onChange={(e) => setConditionValue(e.target.value)}
            className="mt-1 rounded-xl focus-ring"
            placeholder="vip"
            data-testid="automation-conditionValue"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground">Action type</label>
          <Input
            value={actionType}
            onChange={(e) => setActionType(e.target.value)}
            className="mt-1 rounded-xl focus-ring"
            placeholder="send.template"
            data-testid="automation-actionType"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground">Action value</label>
          <Input
            value={actionValue}
            onChange={(e) => setActionValue(e.target.value)}
            className="mt-1 rounded-xl focus-ring"
            placeholder="templateId:12"
            data-testid="automation-actionValue"
          />
        </div>
      </div>

      <Button
        onClick={() => onSave(draft)}
        disabled={saving || !name.trim() || !triggerType.trim() || !actionType.trim()}
        className="w-full rounded-xl shadow-sm hover:shadow-md transition-all"
        data-testid="automation-save"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Wand2 className="h-4 w-4 mr-2" />}
        Save rule
      </Button>
    </div>
  );
}

export default function AutomationPage() {
  const { toast } = useToast();
  const q = useAutomationRules();
  const createM = useCreateAutomationRule();
  const updateM = useUpdateAutomationRule();

  const rules = (q.data || []) as unknown as AutomationRule[];
  const [editing, setEditing] = React.useState<AutomationRule | null>(null);
  const [creating, setCreating] = React.useState(false);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 rise-in" data-testid="page-automation">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl">Automation</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Rules table + slide-over editor. Toggle enabled instantly.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl" onClick={() => q.refetch()} data-testid="automation-refresh">
            Refresh
          </Button>
          <Drawer open={creating} onOpenChange={setCreating}>
            <DrawerTrigger asChild>
              <Button
                className="rounded-xl bg-gradient-to-br from-primary to-primary/85 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all"
                data-testid="automation-create-open"
              >
                <Plus className="h-4 w-4 mr-2" />
                New rule
              </Button>
            </DrawerTrigger>
            <DrawerContent className="rounded-t-3xl" data-testid="automation-create-drawer">
              <div className="mx-auto w-full max-w-2xl p-4">
                <DrawerHeader className="px-0">
                  <DrawerTitle>Create rule</DrawerTitle>
                </DrawerHeader>
                <RuleEditor
                  saving={createM.isPending}
                  onSave={(data) => {
                    createM.mutate(data as any, {
                      onSuccess: () => {
                        toast({ title: "Created", description: "Automation rule added." });
                        setCreating(false);
                      },
                      onError: (e) =>
                        toast({ title: "Create failed", description: String(e.message || e), variant: "destructive" }),
                    });
                  }}
                />
                <div className="mt-3">
                  <DrawerClose asChild>
                    <Button variant="outline" className="w-full rounded-xl" data-testid="automation-create-close">
                      Close
                    </Button>
                  </DrawerClose>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      <Card className="surface-glass rounded-2xl mt-5 overflow-hidden">
        <div className="p-4 border-b border-card-border bg-card/60 backdrop-blur">
          <div className="text-sm font-semibold" data-testid="automation-count">
            {rules.length} rules
          </div>
          <div className="text-xs text-muted-foreground">Keep it simple: one trigger → one action.</div>
        </div>

        <div className="p-2 sm:p-3">
          {q.isLoading ? (
            <div className="p-6 text-sm text-muted-foreground" data-testid="automation-loading">
              <Loader2 className="inline-block h-4 w-4 animate-spin mr-2" />
              Loading rules…
            </div>
          ) : q.isError ? (
            <div className="p-6 text-sm text-destructive" data-testid="automation-error">
              Failed to load. ({String((q.error as any)?.message || q.error)})
            </div>
          ) : rules.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground" data-testid="automation-empty">
              No rules yet. Create one to start automating follow-ups.
            </div>
          ) : (
            <div className="overflow-auto">
              <Table data-testid="automation-table">
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[220px]">Name</TableHead>
                    <TableHead className="min-w-[260px]">Summary</TableHead>
                    <TableHead className="min-w-[120px]">Enabled</TableHead>
                    <TableHead className="text-right min-w-[180px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rules.map((r: any) => (
                    <TableRow key={r.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-semibold">{r.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {ruleSummary(r)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={!!r.enabled}
                            onCheckedChange={(v) => {
                              updateM.mutate(
                                { id: r.id, updates: { enabled: v } as any },
                                {
                                  onError: (e) =>
                                    toast({ title: "Update failed", description: String(e.message || e), variant: "destructive" }),
                                },
                              );
                            }}
                            data-testid={`automation-toggle-${r.id}`}
                          />
                          <span className="text-xs text-muted-foreground">{r.enabled ? "On" : "Off"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          className="rounded-xl"
                          onClick={() => setEditing(r)}
                          data-testid={`automation-edit-open-${r.id}`}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Drawer open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
                <DrawerTrigger asChild>
                  <span className="hidden" />
                </DrawerTrigger>
                <DrawerContent className="rounded-t-3xl" data-testid="automation-edit-drawer">
                  <div className="mx-auto w-full max-w-2xl p-4">
                    <DrawerHeader className="px-0">
                      <DrawerTitle>Edit rule</DrawerTitle>
                    </DrawerHeader>
                    {editing ? (
                      <RuleEditor
                        initial={editing}
                        saving={updateM.isPending}
                        onSave={(data) => {
                          updateM.mutate(
                            { id: (editing as any).id, updates: data as any },
                            {
                              onSuccess: () => {
                                toast({ title: "Saved", description: "Rule updated." });
                                setEditing(null);
                              },
                              onError: (e) =>
                                toast({ title: "Save failed", description: String(e.message || e), variant: "destructive" }),
                            },
                          );
                        }}
                      />
                    ) : null}
                    <div className="mt-3">
                      <DrawerClose asChild>
                        <Button variant="outline" className="w-full rounded-xl" data-testid="automation-edit-close">
                          Close
                        </Button>
                      </DrawerClose>
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
