import * as React from "react";
import type { Template } from "@shared/schema";
import { useTemplates, useCreateTemplate, useUpdateTemplate } from "@/hooks/use-templates";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { Loader2, NotebookPen, Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function useDebounced<T>(value: T, delay = 250) {
  const [v, setV] = React.useState(value);
  React.useEffect(() => {
    const t = window.setTimeout(() => setV(value), delay);
    return () => window.clearTimeout(t);
  }, [value, delay]);
  return v;
}

const statuses = ["Pending", "Approved", "Rejected"] as const;

function TemplateEditor({
  initial,
  saving,
  locked,
  onSave,
}: {
  initial?: Partial<Template>;
  saving?: boolean;
  locked?: boolean;
  onSave: (data: Partial<Template>) => void;
}) {
  const [name, setName] = React.useState(initial?.name ?? "");
  const [content, setContent] = React.useState(initial?.content ?? "");
  const [status, setStatus] = React.useState((initial?.status as any) ?? "Pending");
  const [rejectionReason, setRejectionReason] = React.useState(initial?.rejectionReason ?? "");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4" data-testid="template-editor">
      <div className="space-y-3">
        <div>
          <label className="text-xs font-semibold text-muted-foreground">Template name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 rounded-xl focus-ring"
            placeholder="Welcome + qualification"
            disabled={locked}
            data-testid="template-name"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground">Content</label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 rounded-xl min-h-[200px] focus-ring"
            placeholder="Hey {{name}} — quick question…"
            disabled={locked}
            data-testid="template-content"
          />
          <div className="mt-1 text-[11px] text-muted-foreground">
            Keep it short. Make replies effortless.
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="rounded-2xl border border-card-border bg-gradient-to-br from-primary/10 to-accent/10 p-4">
          <div className="text-xs font-semibold text-muted-foreground">Live preview</div>
          <div className="mt-2 rounded-2xl border border-card-border bg-card p-4 shadow-sm">
            <div className="text-sm font-semibold">{name || "Untitled template"}</div>
            <div className="mt-2 text-sm whitespace-pre-wrap leading-relaxed text-muted-foreground">
              {content || "Start typing to preview your message…"}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 rounded-2xl border border-card-border bg-background/40 p-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Status</label>
            <Select value={status} onValueChange={setStatus as any}>
              <SelectTrigger className="mt-1 rounded-xl focus-ring" data-testid="template-status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {status === "Rejected" ? (
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Rejection reason</label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="mt-1 rounded-xl min-h-[90px] focus-ring"
                placeholder="Missing opt-out line…"
                data-testid="template-rejectionReason"
              />
            </div>
          ) : null}

          <Button
            onClick={() => onSave({ name, content, status, rejectionReason: rejectionReason || null } as any)}
            disabled={saving || locked || !name.trim() || !content.trim()}
            className="rounded-xl shadow-sm hover:shadow-md transition-all"
            data-testid="template-save"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <NotebookPen className="h-4 w-4 mr-2" />}
            Save template
          </Button>

          {locked ? (
            <div className="text-[11px] text-muted-foreground">
              Approved templates are locked. Duplicate it to make changes.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function TemplatesPage() {
  const { toast } = useToast();
  const [search, setSearch] = React.useState("");
  const debounced = useDebounced(search, 250);
  const [status, setStatus] = React.useState<string>("all");

  const q = useTemplates({ search: debounced || undefined, status: status === "all" ? undefined : status });
  const createM = useCreateTemplate();
  const updateM = useUpdateTemplate();

  const templates = (q.data || []) as unknown as Template[];

  const [creating, setCreating] = React.useState(false);
  const [editing, setEditing] = React.useState<Template | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 rise-in" data-testid="page-templates">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl">Templates</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Status-aware editor with live preview. Approved templates are locked.
          </p>
        </div>

        <Drawer open={creating} onOpenChange={setCreating}>
          <DrawerTrigger asChild>
            <Button
              className="rounded-xl bg-gradient-to-br from-primary to-primary/85 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all"
              data-testid="templates-create-open"
            >
              <Plus className="h-4 w-4 mr-2" />
              New template
            </Button>
          </DrawerTrigger>
          <DrawerContent className="rounded-t-3xl" data-testid="templates-create-drawer">
            <div className="mx-auto w-full max-w-5xl p-4">
              <DrawerHeader className="px-0">
                <DrawerTitle>Create template</DrawerTitle>
              </DrawerHeader>
              <TemplateEditor
                saving={createM.isPending}
                onSave={(data) => {
                  createM.mutate(data as any, {
                    onSuccess: () => {
                      toast({ title: "Created", description: "Template added." });
                      setCreating(false);
                    },
                    onError: (e) =>
                      toast({ title: "Create failed", description: String(e.message || e), variant: "destructive" }),
                  });
                }}
              />
              <div className="mt-4">
                <DrawerClose asChild>
                  <Button variant="outline" className="w-full rounded-xl" data-testid="templates-create-close">
                    Close
                  </Button>
                </DrawerClose>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      <Card className="surface-glass rounded-2xl mt-5 overflow-hidden">
        <div className="p-4 border-b border-card-border bg-card/60 backdrop-blur">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_200px_auto] gap-2 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 rounded-xl focus-ring"
                placeholder="Search templates…"
                data-testid="templates-search"
              />
            </div>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="rounded-xl focus-ring" data-testid="templates-filter-status">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {statuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" className="rounded-xl justify-self-start md:justify-self-end" onClick={() => q.refetch()} data-testid="templates-refresh">
              Refresh
            </Button>
          </div>
        </div>

        <div className="p-2 sm:p-3">
          {q.isLoading ? (
            <div className="p-6 text-sm text-muted-foreground" data-testid="templates-loading">
              <Loader2 className="inline-block h-4 w-4 animate-spin mr-2" />
              Loading templates…
            </div>
          ) : q.isError ? (
            <div className="p-6 text-sm text-destructive" data-testid="templates-error">
              Failed to load. ({String((q.error as any)?.message || q.error)})
            </div>
          ) : templates.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground" data-testid="templates-empty">
              No templates yet. Create one for consistent outreach.
            </div>
          ) : (
            <div className="overflow-auto">
              <Table data-testid="templates-table">
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[220px]">Name</TableHead>
                    <TableHead className="min-w-[140px]">Status</TableHead>
                    <TableHead className="min-w-[360px]">Content</TableHead>
                    <TableHead className="text-right min-w-[240px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((t: any) => (
                    <TableRow key={t.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-semibold">{t.name}</TableCell>
                      <TableCell>
                        <StatusBadge value={t.status} />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        <div className="line-clamp-2">{t.content}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex items-center gap-2 justify-end">
                          <Button
                            variant="outline"
                            className="rounded-xl"
                            onClick={() => setEditing(t)}
                            data-testid={`templates-edit-open-${t.id}`}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            className="rounded-xl"
                            onClick={() => {
                              createM.mutate(
                                { name: `${t.name} (copy)`, content: t.content, status: "Pending" } as any,
                                {
                                  onSuccess: () => toast({ title: "Duplicated", description: "Template copied as Pending." }),
                                  onError: (e) =>
                                    toast({ title: "Duplicate failed", description: String(e.message || e), variant: "destructive" }),
                                },
                              );
                            }}
                            data-testid={`templates-duplicate-${t.id}`}
                          >
                            Duplicate
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Drawer open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
                <DrawerTrigger asChild>
                  <span className="hidden" />
                </DrawerTrigger>
                <DrawerContent className="rounded-t-3xl" data-testid="templates-edit-drawer">
                  <div className="mx-auto w-full max-w-5xl p-4">
                    <DrawerHeader className="px-0">
                      <DrawerTitle>Edit template</DrawerTitle>
                    </DrawerHeader>
                    {editing ? (
                      <TemplateEditor
                        initial={editing}
                        locked={editing.status === "Approved"}
                        saving={updateM.isPending}
                        onSave={(data) => {
                          updateM.mutate(
                            { id: (editing as any).id, updates: data as any },
                            {
                              onSuccess: () => {
                                toast({ title: "Saved", description: "Template updated." });
                                setEditing(null);
                              },
                              onError: (e) =>
                                toast({ title: "Save failed", description: String(e.message || e), variant: "destructive" }),
                            },
                          );
                        }}
                      />
                    ) : null}
                    <div className="mt-4">
                      <DrawerClose asChild>
                        <Button variant="outline" className="w-full rounded-xl" data-testid="templates-edit-close">
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
