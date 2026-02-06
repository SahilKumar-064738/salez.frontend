import * as React from "react";
import type { Campaign, Contact, Stage, Template } from "@shared/schema";
import { stages } from "@shared/schema";
import { useCampaigns, useCreateCampaign, useUpdateCampaign } from "@/hooks/use-broadcast";
import { useContacts } from "@/hooks/use-contacts";
import { useTemplates } from "@/hooks/use-templates";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Send, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Step = 1 | 2 | 3 | 4;

function fmtDateTime(d?: Date | string | null) {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleString(undefined, { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export default function BroadcastPage() {
  const { toast } = useToast();

  const campaignsQ = useCampaigns();
  const templatesQ = useTemplates({ search: "", status: undefined });
  const contactsQ = useContacts({ search: "" });

  const createM = useCreateCampaign();
  const updateM = useUpdateCampaign();

  const campaigns = (campaignsQ.data || []) as unknown as Campaign[];
  const templates = (templatesQ.data || []) as unknown as Template[];
  const contacts = (contactsQ.data || []) as unknown as Contact[];

  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState<Step>(1);

  const [name, setName] = React.useState("");
  const [templateId, setTemplateId] = React.useState<string>("none");
  const [audStage, setAudStage] = React.useState<string>("all");
  const [audTag, setAudTag] = React.useState<string>("");
  const [scheduleMode, setScheduleMode] = React.useState<"now" | "later">("later");
  const [scheduledAt, setScheduledAt] = React.useState<string>("");

  const tagsIndex = React.useMemo(() => {
    const set = new Set<string>();
    contacts.forEach((c: any) => (c.tags || []).forEach((t: string) => set.add(t)));
    return Array.from(set).sort((a, b) => a.localeCompare(b)).slice(0, 40);
  }, [contacts]);

  const audience = React.useMemo(() => {
    return contacts.filter((c: any) => {
      if (audStage !== "all" && c.stage !== audStage) return false;
      if (audTag && !(c.tags || []).includes(audTag)) return false;
      return true;
    });
  }, [contacts, audStage, audTag]);

  const selectedTemplate = React.useMemo(
    () => templates.find((t: any) => String(t.id) === templateId) || null,
    [templates, templateId],
  );

  const reset = () => {
    setStep(1);
    setName("");
    setTemplateId("none");
    setAudStage("all");
    setAudTag("");
    setScheduleMode("later");
    setScheduledAt("");
  };

  const canNext1 = name.trim().length >= 2;
  const canNext2 = templateId !== "none";
  const canNext3 = audience.length > 0;
  const canFinish = scheduleMode === "now" ? true : !!scheduledAt;

  const createOrSchedule = () => {
    const status = scheduleMode === "now" ? "Running" : "Scheduled";
    const payload: any = {
      name,
      status,
      templateId: templateId === "none" ? null : Number(templateId),
      scheduledAt: scheduleMode === "later" ? new Date(scheduledAt).toISOString() : null,
    };

    createM.mutate(payload, {
      onSuccess: () => {
        toast({ title: "Campaign created", description: `Audience: ${audience.length} contacts.` });
        setOpen(false);
        reset();
      },
      onError: (e) => toast({ title: "Create failed", description: String(e.message || e), variant: "destructive" }),
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 rise-in" data-testid="page-broadcast">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl">Broadcast</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Campaigns table + step-by-step builder. Filter audience by stage/tags, schedule, preview.
          </p>
        </div>

        <Drawer open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
          <DrawerTrigger asChild>
            <Button
              className="rounded-xl bg-gradient-to-br from-primary to-primary/85 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all"
              data-testid="broadcast-create-open"
            >
              <Plus className="h-4 w-4 mr-2" />
              New campaign
            </Button>
          </DrawerTrigger>
          <DrawerContent className="rounded-t-3xl" data-testid="broadcast-builder-drawer">
            <div className="mx-auto w-full max-w-5xl p-4">
              <DrawerHeader className="px-0">
                <DrawerTitle>Campaign builder</DrawerTitle>
              </DrawerHeader>

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
                <Card className="rounded-2xl border-card-border bg-card/70 shadow-sm">
                  <div className="p-4 border-b border-card-border flex items-center justify-between gap-2">
                    <div className="text-sm font-semibold">Step {step} of 4</div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => setStep((s) => Math.max(1, (s - 1) as any))}
                        disabled={step === 1}
                        data-testid="broadcast-prev"
                      >
                        Back
                      </Button>
                      <Button
                        className="rounded-xl"
                        onClick={() => setStep((s) => Math.min(4, (s + 1) as any))}
                        disabled={(step === 1 && !canNext1) || (step === 2 && !canNext2) || (step === 3 && !canNext3) || step === 4}
                        data-testid="broadcast-next"
                      >
                        Next
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 space-y-4">
                    {step === 1 ? (
                      <div data-testid="broadcast-step-1">
                        <label className="text-xs font-semibold text-muted-foreground">Campaign name</label>
                        <Input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="February reactivation"
                          className="mt-1 rounded-xl focus-ring"
                          data-testid="broadcast-name"
                        />
                        <div className="mt-2 text-[11px] text-muted-foreground">
                          Tip: Make it specific to a segment or offer.
                        </div>
                      </div>
                    ) : null}

                    {step === 2 ? (
                      <div className="space-y-3" data-testid="broadcast-step-2">
                        <label className="text-xs font-semibold text-muted-foreground">Choose template</label>
                        <Select value={templateId} onValueChange={setTemplateId}>
                          <SelectTrigger className="rounded-xl focus-ring" data-testid="broadcast-template">
                            <SelectValue placeholder="Select a template" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Select…</SelectItem>
                            {templates.map((t: any) => (
                              <SelectItem key={t.id} value={String(t.id)}>
                                {t.name} {t.status === "Approved" ? "• Approved" : ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {selectedTemplate ? (
                          <div className="rounded-2xl border border-card-border bg-background/40 p-4">
                            <div className="flex items-center justify-between gap-2">
                              <div className="text-sm font-semibold">{selectedTemplate.name}</div>
                              <StatusBadge value={selectedTemplate.status} />
                            </div>
                            <div className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                              {selectedTemplate.content}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    {step === 3 ? (
                      <div className="space-y-3" data-testid="broadcast-step-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs font-semibold text-muted-foreground">Stage</label>
                            <Select value={audStage} onValueChange={setAudStage}>
                              <SelectTrigger className="mt-1 rounded-xl focus-ring" data-testid="broadcast-audience-stage">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All stages</SelectItem>
                                {stages.map((s) => (
                                  <SelectItem key={s} value={s}>
                                    {s}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-muted-foreground">Tag</label>
                            <Select value={audTag || "all"} onValueChange={(v) => setAudTag(v === "all" ? "" : v)}>
                              <SelectTrigger className="mt-1 rounded-xl focus-ring" data-testid="broadcast-audience-tag">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All tags</SelectItem>
                                {tagsIndex.map((t) => (
                                  <SelectItem key={t} value={t}>
                                    {t}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-card-border bg-gradient-to-br from-primary/10 to-accent/10 p-4">
                          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                            <Sparkles className="h-4 w-4 text-primary" />
                            Computed audience
                          </div>
                          <div className="mt-2 flex items-baseline justify-between">
                            <div className="text-2xl font-bold" data-testid="broadcast-audience-count">{audience.length}</div>
                            <Badge variant="outline" className="rounded-full">
                              {audStage === "all" ? "All stages" : `Stage: ${audStage}`}
                              {audTag ? ` • Tag: ${audTag}` : ""}
                            </Badge>
                          </div>
                          <div className="mt-3 text-xs text-muted-foreground">
                            Preview (first 5): {audience.slice(0, 5).map((c: any) => c.name).join(", ") || "—"}
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {step === 4 ? (
                      <div className="space-y-3" data-testid="broadcast-step-4">
                        <div className="rounded-2xl border border-card-border bg-background/40 p-4">
                          <div className="text-sm font-semibold">Preview</div>
                          <div className="mt-2 text-xs text-muted-foreground">Campaign</div>
                          <div className="text-sm">{name || "—"}</div>
                          <div className="mt-2 text-xs text-muted-foreground">Template</div>
                          <div className="text-sm">{selectedTemplate?.name || "—"}</div>
                          <div className="mt-2 text-xs text-muted-foreground">Audience</div>
                          <div className="text-sm">{audience.length} contacts</div>
                        </div>

                        <div className="rounded-2xl border border-card-border bg-gradient-to-br from-card to-muted/30 p-4">
                          <div className="text-sm font-semibold">Schedule</div>
                          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <Button
                              variant={scheduleMode === "now" ? "default" : "outline"}
                              className="rounded-xl"
                              onClick={() => setScheduleMode("now")}
                              data-testid="broadcast-send-now"
                            >
                              Send now
                            </Button>
                            <Button
                              variant={scheduleMode === "later" ? "default" : "outline"}
                              className="rounded-xl"
                              onClick={() => setScheduleMode("later")}
                              data-testid="broadcast-schedule-later"
                            >
                              Schedule
                            </Button>
                          </div>

                          {scheduleMode === "later" ? (
                            <div className="mt-3">
                              <label className="text-xs font-semibold text-muted-foreground">Scheduled at (ISO-ish)</label>
                              <Input
                                value={scheduledAt}
                                onChange={(e) => setScheduledAt(e.target.value)}
                                className="mt-1 rounded-xl focus-ring"
                                placeholder="2026-02-10T10:00:00Z"
                                data-testid="broadcast-scheduledAt"
                              />
                            </div>
                          ) : null}

                          <Button
                            onClick={createOrSchedule}
                            disabled={createM.isPending || !canFinish || !canNext1 || !canNext2 || !canNext3}
                            className="mt-4 w-full rounded-xl bg-gradient-to-br from-primary to-primary/85 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all"
                            data-testid="broadcast-finish"
                          >
                            {createM.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                            {scheduleMode === "now" ? "Create & start" : "Create & schedule"}
                          </Button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </Card>

                <div className="space-y-3">
                  <Card className="rounded-2xl border-card-border bg-card/70 shadow-sm">
                    <div className="p-4 border-b border-card-border">
                      <div className="text-sm font-semibold">Builder notes</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        MVP computes audience on the client. Backend may enforce rules & limits.
                      </div>
                    </div>
                    <div className="p-4 text-sm text-muted-foreground">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Templates can be Pending/Approved/Rejected.</li>
                        <li>Campaign status becomes Scheduled or Running.</li>
                        <li>Use Analytics to track response rate.</li>
                      </ul>
                    </div>
                  </Card>

                  <DrawerClose asChild>
                    <Button variant="outline" className="w-full rounded-xl" data-testid="broadcast-close">
                      Close
                    </Button>
                  </DrawerClose>
                </div>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      <Card className="surface-glass rounded-2xl mt-5 overflow-hidden">
        <div className="p-4 border-b border-card-border bg-card/60 backdrop-blur flex items-center justify-between gap-2">
          <div>
            <div className="text-sm font-semibold" data-testid="broadcast-count">{campaigns.length} campaigns</div>
            <div className="text-xs text-muted-foreground">Draft → Scheduled/Running → Completed.</div>
          </div>
          <Button variant="outline" className="rounded-xl" onClick={() => campaignsQ.refetch()} data-testid="broadcast-refresh">
            Refresh
          </Button>
        </div>

        <div className="p-2 sm:p-3">
          {campaignsQ.isLoading ? (
            <div className="p-6 text-sm text-muted-foreground" data-testid="broadcast-loading">
              <Loader2 className="inline-block h-4 w-4 animate-spin mr-2" />
              Loading campaigns…
            </div>
          ) : campaignsQ.isError ? (
            <div className="p-6 text-sm text-destructive" data-testid="broadcast-error">
              Failed to load. ({String((campaignsQ.error as any)?.message || campaignsQ.error)})
            </div>
          ) : campaigns.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground" data-testid="broadcast-empty">
              No campaigns yet. Build your first broadcast in minutes.
            </div>
          ) : (
            <div className="overflow-auto">
              <Table data-testid="broadcast-table">
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[220px]">Name</TableHead>
                    <TableHead className="min-w-[140px]">Status</TableHead>
                    <TableHead className="min-w-[180px]">Scheduled</TableHead>
                    <TableHead className="min-w-[120px]">Sent</TableHead>
                    <TableHead className="min-w-[120px]">Replies</TableHead>
                    <TableHead className="text-right min-w-[260px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((c: any) => (
                    <TableRow key={c.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-semibold">{c.name}</TableCell>
                      <TableCell><StatusBadge value={c.status} /></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{fmtDateTime(c.scheduledAt)}</TableCell>
                      <TableCell className="text-sm">{c.sentCount ?? 0}</TableCell>
                      <TableCell className="text-sm">{c.repliedCount ?? 0}</TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex items-center gap-2 justify-end">
                          <Button
                            variant="outline"
                            className="rounded-xl"
                            onClick={() => {
                              updateM.mutate(
                                { id: c.id, updates: { status: c.status === "Paused" ? "Running" : "Paused" } as any },
                                {
                                  onSuccess: () => toast({ title: "Updated", description: "Campaign status changed." }),
                                  onError: (e) =>
                                    toast({ title: "Update failed", description: String(e.message || e), variant: "destructive" }),
                                },
                              );
                            }}
                            data-testid={`broadcast-toggle-${c.id}`}
                          >
                            {c.status === "Paused" ? "Resume" : "Pause"}
                          </Button>
                          <Button
                            variant="outline"
                            className="rounded-xl"
                            onClick={() => {
                              updateM.mutate(
                                { id: c.id, updates: { status: "Completed" } as any },
                                {
                                  onSuccess: () => toast({ title: "Completed", description: "Campaign marked completed." }),
                                  onError: (e) =>
                                    toast({ title: "Update failed", description: String(e.message || e), variant: "destructive" }),
                                },
                              );
                            }}
                            data-testid={`broadcast-complete-${c.id}`}
                          >
                            Complete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
