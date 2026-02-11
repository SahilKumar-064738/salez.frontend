import * as React from "react";
import { Link } from "wouter";
import type { Contact, Stage } from "@shared/schema";
import { useContacts, useCreateContact, useUpdateContact } from "@/hooks/use-contacts";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { StageBadge } from "@/components/StageBadge";
import { cn } from "@/lib/utils";
import { Loader2, MessageSquareText, Plus, Search, Tag, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { stages } from "@shared/schema";

function useDebounced<T>(value: T, delay = 250) {
  const [v, setV] = React.useState(value);
  React.useEffect(() => {
    const t = window.setTimeout(() => setV(value), delay);
    return () => window.clearTimeout(t);
  }, [value, delay]);
  return v;
}

function fmtDate(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString(undefined, { month: "short", day: "2-digit" });
}

function Tags({ tags, onClickTag }: { tags: string[]; onClickTag: (t: string) => void }) {
  if (!tags?.length) return <span className="text-xs text-muted-foreground">—</span>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.slice(0, 4).map((t) => (
        <button
          key={t}
          onClick={() => onClickTag(t)}
          className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 px-2 py-0.5 text-[11px] font-semibold text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-all"
          data-testid={`contact-tag-${t}`}
        >
          <Tag className="h-3 w-3" />
          {t}
        </button>
      ))}
      {tags.length > 4 ? (
        <Badge variant="outline" className="rounded-full text-[11px]">
          +{tags.length - 4}
        </Badge>
      ) : null}
    </div>
  );
}

function ContactEditor({
  mode,
  initial,
  onSave,
  saving,
}: {
  mode: "create" | "edit";
  initial?: Partial<Contact>;
  onSave: (data: { name: string; phone: string; stage: Stage; tags: string[] }) => void;
  saving?: boolean;
}) {
  const [name, setName] = React.useState(initial?.name ?? "");
  const [phone, setPhone] = React.useState(initial?.phone ?? "");
  const [stage, setStage] = React.useState<Stage>((initial?.stage as any) ?? "New");
  const [tagsRaw, setTagsRaw] = React.useState((initial?.tags as any)?.join(", ") ?? "");

  const tags = React.useMemo(
    () =>
      tagsRaw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 12),
    [tagsRaw],
  );

  return (
    <div className="space-y-4" data-testid={`contact-editor-${mode}`}>
      <div className="flex flex-col min-h-[calc(100vh-120px)] rise-in px-3 sm:px-4 lg:px-6">
        <div>
          <label className="text-xs font-semibold text-muted-foreground">Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ada Lovelace"
            className="mt-1 rounded-xl focus-ring"
            data-testid="contact-name"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground">Phone</label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 555 0100"
            className="mt-1 rounded-xl focus-ring"
            data-testid="contact-phone"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-muted-foreground">Stage</label>
          <Select value={stage} onValueChange={(v) => setStage(v as any)}>
            <SelectTrigger className="mt-1 rounded-xl focus-ring" data-testid="contact-stage">
              <SelectValue placeholder="Select stage" />
            </SelectTrigger>
            <SelectContent>
              {stages.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground">Tags</label>
          <Input
            value={tagsRaw}
            onChange={(e) => setTagsRaw(e.target.value)}
            placeholder="vip, demo, inbound"
            className="mt-1 rounded-xl focus-ring"
            data-testid="contact-tags"
          />
          <div className="mt-1 text-[11px] text-muted-foreground">
            Comma-separated. Click tags to filter in the table.
          </div>
        </div>
      </div>

      <Button
        onClick={() => onSave({ name, phone, stage, tags })}
        disabled={saving || !name.trim() || !phone.trim()}
        className="w-full rounded-xl shadow-sm hover:shadow-md transition-all"
        data-testid="contact-save"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
        {mode === "create" ? "Create contact" : "Save changes"}
      </Button>
    </div>
  );
}

export default function ContactsPage() {
  const { toast } = useToast();

  const [search, setSearch] = React.useState("");
  const debounced = useDebounced(search, 250);

  const [stage, setStage] = React.useState<string>("all");
  const [tag, setTag] = React.useState<string>("");

  const q = useContacts({
    search: debounced || undefined,
    stage: stage === "all" ? undefined : stage,
    tag: tag || undefined,
  });

  const createM = useCreateContact();
  const updateM = useUpdateContact();

  const [edit, setEdit] = React.useState<Contact | null>(null);

  const contacts = (q.data || []) as unknown as Contact[];

  const tagsIndex = React.useMemo(() => {
    const set = new Set<string>();
    contacts.forEach((c: any) => (c.tags || []).forEach((t: string) => set.add(t)));
    return Array.from(set).sort((a, b) => a.localeCompare(b)).slice(0, 30);
  }, [contacts]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-120px)] rise-in" data-testid="page-contacts">
      <Card className="surface-glass rounded-2xl overflow-hidden flex flex-col flex-1 min-h-0">
        {/* Header */}
        <div className="shrink-0 border-b bg-card/65 backdrop-blur border-card-border">
          <div className="p-4 sm:p-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl">Contacts</h1>
                <p className="text-sm text-muted-foreground">
                  Spreadsheet-fast CRM. Filter by stage & tags. One-click open chat.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="rounded-xl bg-gradient-to-br from-primary to-primary/85 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all"
                      data-testid="contact-create-open"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New contact
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[640px] rounded-2xl" data-testid="contact-create-dialog">
                    <DialogHeader>
                      <DialogTitle>Create contact</DialogTitle>
                    </DialogHeader>
                    <ContactEditor
                      mode="create"
                      onSave={(data) => {
                        createM.mutate(
                          { ...data },
                          {
                            onSuccess: () => toast({ title: "Created", description: "Contact added to your CRM." }),
                            onError: (e) =>
                              toast({
                                title: "Create failed",
                                description: String((e as any)?.message || e),
                                variant: "destructive",
                              }),
                          },
                        );
                      }}
                      saving={createM.isPending}
                    />
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  onClick={() => q.refetch()}
                  className="rounded-xl"
                  data-testid="contacts-refresh"
                >
                  Refresh
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-[1fr_180px_220px_auto] gap-2 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name or phone…"
                  className="pl-9 rounded-xl focus-ring"
                  data-testid="contacts-search"
                />
              </div>

              <Select value={stage} onValueChange={setStage}>
                <SelectTrigger className="rounded-xl focus-ring" data-testid="contacts-filter-stage">
                  <SelectValue placeholder="Stage" />
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

              <Select value={tag || "all"} onValueChange={(v) => setTag(v === "all" ? "" : v)}>
                <SelectTrigger className="rounded-xl focus-ring" data-testid="contacts-filter-tag">
                  <SelectValue placeholder="Tag" />
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

              <Button
                variant="ghost"
                onClick={() => {
                  setSearch("");
                  setStage("all");
                  setTag("");
                }}
                className="rounded-xl justify-self-start md:justify-self-end"
                data-testid="contacts-clear-filters"
              >
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>

            {tag ? (
              <div
                className="mt-3 inline-flex items-center gap-2 text-xs text-muted-foreground"
                data-testid="contacts-active-tag"
              >
                <span className="font-semibold text-foreground">Filtering by tag:</span>
                <Badge variant="outline" className="rounded-full">
                  {tag}
                </Badge>
              </div>
            ) : null}
          </div>
        </div>

        {/* Content area (scrolls) */}
        <div className="flex-1 min-h-0 overflow-auto px-2 sm:px-3">
          {q.isLoading ? (
            <div className="p-6 text-sm text-muted-foreground" data-testid="contacts-loading">
              <Loader2 className="inline-block h-4 w-4 animate-spin mr-2" />
              Loading contacts…
            </div>
          ) : q.isError ? (
            <div className="p-6 text-sm text-destructive" data-testid="contacts-error">
              Failed to load contacts. ({String((q.error as any)?.message || q.error)})
            </div>
          ) : contacts.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground" data-testid="contacts-empty">
              No contacts found. Create your first contact to start messaging.
            </div>
          ) : (
            <div className="p-2 sm:p-3">
              <div className="overflow-auto">
                <Table data-testid="contacts-table">
                  <TableHeader className="sticky top-0 z-20 bg-card">
                    <TableRow>
                      <TableHead className="min-w-[220px]">Name</TableHead>
                      <TableHead className="min-w-[160px]">Phone</TableHead>
                      <TableHead className="min-w-[140px]">Stage</TableHead>
                      <TableHead className="min-w-[260px]">Tags</TableHead>
                      <TableHead className="min-w-[140px]">Last active</TableHead>
                      <TableHead className="text-right min-w-[220px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {contacts.map((c: any) => (
                      <TableRow key={c.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-semibold">
                          <div className="truncate max-w-[260px]" data-testid={`contact-name-${c.id}`}>
                            {c.name}
                          </div>
                        </TableCell>

                        <TableCell className="text-sm text-muted-foreground" data-testid={`contact-phone-${c.id}`}>
                          {c.phone}
                        </TableCell>

                        <TableCell>
                          <Select
                            value={c.stage}
                            onValueChange={(v) => {
                              updateM.mutate(
                                { id: c.id, updates: { stage: v as any } },
                                {
                                  onError: (e) =>
                                    toast({
                                      title: "Update failed",
                                      description: String((e as any)?.message || e),
                                      variant: "destructive",
                                    }),
                                },
                              );
                            }}
                          >
                            <SelectTrigger
                              className="rounded-xl h-9 focus-ring bg-background/40"
                              data-testid={`contact-stage-inline-${c.id}`}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {stages.map((s) => (
                                <SelectItem key={s} value={s}>
                                  <div className="flex items-center gap-2">
                                    <StageBadge stage={s} />
                                    <span>{s}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>

                        <TableCell>
                          <Tags tags={c.tags || []} onClickTag={(t) => setTag(t)} />
                        </TableCell>

                        <TableCell className="text-sm text-muted-foreground" data-testid={`contact-lastactive-${c.id}`}>
                          {c.lastActiveAt ? fmtDate(c.lastActiveAt) : "—"}
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="inline-flex items-center gap-2 justify-end">
                            <Button
                              variant="outline"
                              className="rounded-xl"
                              onClick={() => setEdit(c)}
                              data-testid={`contact-edit-open-${c.id}`}
                            >
                              Edit
                            </Button>

                            <Link
                              href="/inbox"
                              className={cn(
                                "inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm font-semibold",
                                "bg-gradient-to-br from-primary/12 to-accent/8 border-primary/20 hover:shadow-sm transition-all",
                              )}
                              data-testid={`contact-open-chat-${c.id}`}
                            >
                              <MessageSquareText className="h-4 w-4 mr-2 text-primary" />
                              Chat
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Edit drawer */}
                <Drawer open={!!edit} onOpenChange={(v) => !v && setEdit(null)}>
                  <DrawerTrigger asChild>
                    <span className="hidden" />
                  </DrawerTrigger>
                  <DrawerContent className="rounded-t-3xl" data-testid="contact-edit-drawer">
                    <div className="mx-auto w-full max-w-2xl p-4">
                      <DrawerHeader className="px-0">
                        <DrawerTitle>Edit contact</DrawerTitle>
                      </DrawerHeader>

                      {edit ? (
                        <ContactEditor
                          mode="edit"
                          initial={edit}
                          saving={updateM.isPending}
                          onSave={(data) => {
                            updateM.mutate(
                              { id: (edit as any).id, updates: { ...data } as any },
                              {
                                onSuccess: () => {
                                  toast({ title: "Saved", description: "Contact updated." });
                                  setEdit(null);
                                },
                                onError: (e) =>
                                  toast({
                                    title: "Save failed",
                                    description: String((e as any)?.message || e),
                                    variant: "destructive",
                                  }),
                              },
                            );
                          }}
                        />
                      ) : null}

                      <div className="mt-3">
                        <DrawerClose asChild>
                          <Button variant="outline" className="w-full rounded-xl" data-testid="contact-edit-close">
                            Close
                          </Button>
                        </DrawerClose>
                      </div>
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}