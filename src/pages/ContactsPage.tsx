import * as React from "react";
import { Link } from "wouter";
import type { Stage } from "@shared/schema";
import { useContacts, useCreateContact, useUpdateContact, useDeleteContact } from "@/hooks/use-contacts";
import type { Contact } from "@/services/contactsService";
import { contactsService } from "@/services/contactsService";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { StageBadge } from "@/components/StageBadge";
import { cn } from "@/lib/utils";
import { Loader2, MessageSquareText, Plus, Search, Tag, X, Upload, Download, Eye, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { stages, stageLabels } from "@shared/schema";
import Papa from "papaparse";

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
      {tags.slice(0, 3).map((t) => (
        <button key={t} onClick={() => onClickTag(t)}
          className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 px-2 py-0.5 text-[11px] font-semibold text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-all">
          <Tag className="h-3 w-3" />{t}
        </button>
      ))}
      {tags.length > 3 ? <Badge variant="outline" className="rounded-full text-[11px]">+{tags.length - 3}</Badge> : null}
    </div>
  );
}

// ── CSV Import Modal ──────────────────────────────────────────────────────────
const NAME_HEADERS = ["name", "Name", "NAME", "full_name", "Full Name", "fullname"];
const PHONE_HEADERS = ["phone", "Phone", "PHONE", "mobile", "Mobile", "MOBILE", "phone_number", "Phone Number", "contact"];

function parseCSVContacts(rows: any[]): { name: string; phone: string }[] {
  return rows.map((row) => {
    const name = String(NAME_HEADERS.reduce((acc, h) => acc || row[h] || "", "") || "").trim();
    const phone = String(PHONE_HEADERS.reduce((acc, h) => acc || row[h] || "", "") || "").trim();
    return { name, phone };
  }).filter((r) => r.name && r.phone);
}

function CSVImportModal({ onClose }: { onClose: () => void }) {
  const { toast } = useToast();
  const [preview, setPreview] = React.useState<{ name: string; phone: string }[] | null>(null);
  const [importing, setImporting] = React.useState(false);
  const [result, setResult] = React.useState<{ created: number; failed: number; errors: string[] } | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = parseCSVContacts(results.data as any[]);
        if (parsed.length === 0) {
          toast({ title: "No valid rows", description: "CSV must have name and phone columns.", variant: "destructive" });
          return;
        }
        setPreview(parsed);
      },
    });
    e.target.value = "";
  };

  const handleImport = async () => {
    if (!preview) return;
    setImporting(true);
    const res = await contactsService.bulkCreate(preview);
    setImporting(false);
    setResult(res);
    if (res.created > 0) {
      toast({ title: `Imported ${res.created} contacts`, description: res.failed ? `${res.failed} failed.` : "All imported successfully." });
    }
  };

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Upload className="h-4 w-4" /> Import Contacts from CSV</DialogTitle>
        </DialogHeader>

        {result ? (
          <div className="space-y-4 py-2">
            <div className="rounded-xl border p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />{result.created} contacts imported
              </div>
              {result.failed > 0 && (
                <div className="flex items-center gap-2 text-sm font-semibold text-destructive">
                  <AlertCircle className="h-4 w-4" />{result.failed} failed
                </div>
              )}
              {result.errors.slice(0, 5).map((err, i) => (
                <p key={i} className="text-xs text-muted-foreground">• {err}</p>
              ))}
            </div>
            <Button className="w-full" onClick={onClose}>Done</Button>
          </div>
        ) : preview ? (
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Eye className="h-4 w-4" /> Preview — {preview.length} contacts detected
            </div>
            <div className="rounded-xl border overflow-hidden max-h-64 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold">#</th>
                    <th className="px-3 py-2 text-left font-semibold">Name</th>
                    <th className="px-3 py-2 text-left font-semibold">Phone</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {preview.slice(0, 50).map((row, i) => (
                    <tr key={i} className="hover:bg-muted/30">
                      <td className="px-3 py-1.5 text-muted-foreground">{i + 1}</td>
                      <td className="px-3 py-1.5">{row.name}</td>
                      <td className="px-3 py-1.5 font-mono text-xs">{row.phone}</td>
                    </tr>
                  ))}
                  {preview.length > 50 && (
                    <tr><td colSpan={3} className="px-3 py-2 text-xs text-muted-foreground text-center">...and {preview.length - 50} more</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground">Only <strong>name</strong> and <strong>phone</strong> fields are imported. All other columns are ignored.</p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setPreview(null)} className="flex-1">← Back</Button>
              <Button onClick={handleImport} disabled={importing} className="flex-1">
                {importing ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Importing…</> : `Import ${preview.length} Contacts`}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div className="rounded-xl border-2 border-dashed border-border p-8 text-center hover:border-primary/50 transition-colors">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-sm font-semibold mb-1">Choose a CSV file</p>
              <p className="text-xs text-muted-foreground mb-4">Accepts: name, Name, full_name · phone, Phone, mobile</p>
              <label className="inline-flex items-center gap-2 cursor-pointer bg-primary text-primary-foreground rounded-xl px-4 py-2 text-sm font-semibold hover:bg-primary/90 transition-colors">
                <Upload className="h-4 w-4" /> Browse CSV
                <input type="file" accept=".csv" className="hidden" onChange={handleFile} />
              </label>
            </div>
            <div className="rounded-xl bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">Supported column names:</p>
              <p>• Name: <code>name</code>, <code>Name</code>, <code>full_name</code></p>
              <p>• Phone: <code>phone</code>, <code>Phone</code>, <code>mobile</code>, <code>Mobile</code></p>
              <p>All other columns are ignored.</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ── Contact Editor ─────────────────────────────────────────────────────────────
function ContactEditor({ mode, initial, onSave, saving }: {
  mode: "create" | "edit";
  initial?: Partial<Contact>;
  onSave: (data: { name: string; phone: string; stage: Stage; notes: string }) => void;
  saving?: boolean;
}) {
  const [name, setName] = React.useState(initial?.name ?? "");
  const [phone, setPhone] = React.useState(initial?.phone ?? "");
  const [stage, setStage] = React.useState<Stage>((initial?.stage as any) ?? "new");
  const [notes, setNotes] = React.useState(initial?.notes ?? "");

  return (
    <div className="space-y-4 py-2">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-muted-foreground">Name *</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="mt-1" />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground">Phone *</label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 99999 99999" className="mt-1" disabled={mode === "edit"} />
          {mode === "edit" && <p className="text-[10px] text-muted-foreground mt-1">Phone cannot be changed after creation.</p>}
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold text-muted-foreground">Stage</label>
        <Select value={stage} onValueChange={(v) => setStage(v as any)}>
          <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
          <SelectContent>
            {stages.map((s) => <SelectItem key={s} value={s}>{stageLabels[s]}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-xs font-semibold text-muted-foreground">Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any notes about this contact…"
          className="mt-1 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm resize-none h-20 outline-none focus:ring-1 focus:ring-ring" />
      </div>
      <Button onClick={() => onSave({ name, phone, stage, notes })} disabled={saving || !name.trim() || !phone.trim()} className="w-full">
        {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
        {mode === "create" ? "Create contact" : "Save changes"}
      </Button>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function ContactsPage() {
  const { toast } = useToast();
  const [search, setSearch] = React.useState("");
  const debounced = useDebounced(search);
  const [stage, setStage] = React.useState<string>("all");
  const [tag, setTag] = React.useState<string>("");
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editContact, setEditContact] = React.useState<Contact | null>(null);
  const [csvOpen, setCsvOpen] = React.useState(false);

  const q = useContacts({ search: debounced || undefined, stage: stage === "all" ? undefined : stage, tag: tag || undefined });
  const createM = useCreateContact();
  const updateM = useUpdateContact();
  const deleteM = useDeleteContact();

  const contacts = (q.data || []) as unknown as Contact[];

  const tagsIndex = React.useMemo(() => {
    const set = new Set<string>();
    contacts.forEach((c: any) => (c.tags || []).forEach((t: string) => set.add(t)));
    return Array.from(set).sort().slice(0, 30);
  }, [contacts]);

  // ── CSV Export ────────────────────────────────────────────────────────────
  const handleExport = () => {
    if (!contacts.length) return;
    const csv = Papa.unparse(contacts.map((c: any) => ({
      name: c.name,
      phone: c.phone,
      stage: c.stage || "",
      notes: c.notes || "",
      tags: (c.tags || []).join(";"),
      created_at: c.created_at || "",
    })));
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contacts-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exported", description: `${contacts.length} contacts saved as CSV.` });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]" data-testid="page-contacts">
      {csvOpen && <CSVImportModal onClose={() => { setCsvOpen(false); q.refetch(); }} />}

      <Card className="surface-glass rounded-none sm:rounded-2xl overflow-hidden flex flex-col flex-1 min-h-0 m-0 sm:m-4 border-0 sm:border">
        {/* Header */}
        <div className="shrink-0 border-b bg-card/80 backdrop-blur px-4 sm:px-5 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold">Contacts</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {q.data ? `${contacts.length} contacts` : "Loading…"} · cursor-paginated · limit 100/page
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={() => setCsvOpen(true)} className="gap-2">
                <Upload className="h-3.5 w-3.5" /> Import CSV
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport} disabled={!contacts.length} className="gap-2 rounded-xl hover:scale-105 transition-all">
                <Download className="h-3.5 w-3.5" /> Export CSV
              </Button>
              <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2 rounded-xl bg-green-600 hover:bg-green-700 shadow-md hover:scale-105 transition-all" data-testid="contact-create-open">
                    <Plus className="h-3.5 w-3.5" /> New Contact
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader><DialogTitle>Create Contact</DialogTitle></DialogHeader>
                  <ContactEditor mode="create" saving={createM.isPending}
                    onSave={(data) => createM.mutate({ ...data }, {
                      onSuccess: () => { toast({ title: "Contact created" }); setCreateOpen(false); },
                      onError: (e) => toast({ title: "Failed", description: String((e as any)?.message || e), variant: "destructive" }),
                    })} />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-3 flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[160px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or phone…" className="pl-8 h-8 text-sm" />
            </div>
            <Select value={stage} onValueChange={setStage}>
              <SelectTrigger className="w-[140px] h-8 text-sm"><SelectValue placeholder="Stage" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All stages</SelectItem>
                {stages.map((s) => <SelectItem key={s} value={s}>{stageLabels[s]}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={tag || "all"} onValueChange={(v) => setTag(v === "all" ? "" : v)}>
              <SelectTrigger className="w-[140px] h-8 text-sm"><SelectValue placeholder="Tag" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All tags</SelectItem>
                {tagsIndex.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            {(search || stage !== "all" || tag) && (
              <Button variant="ghost" size="sm" onClick={() => { setSearch(""); setStage("all"); setTag(""); }} className="h-8 gap-1">
                <X className="h-3.5 w-3.5" /> Clear
              </Button>
            )}
          </div>
        </div>

        {/* Card List */}
        <div className="flex-1 min-h-0 overflow-auto p-4 sm:p-5">
          {q.isLoading ? (
            <div className="flex items-center justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : q.isError ? (
            <div className="p-6 text-sm text-destructive">Failed to load contacts: {String((q.error as any)?.message || q.error)}</div>
          ) : contacts.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <p className="text-sm text-muted-foreground">No contacts found.</p>
              <Button size="sm" onClick={() => setCreateOpen(true)}>Create your first contact</Button>
            </div>
          ) : (
            <div className="space-y-3">
              {contacts.map((c: any) => (
                <div
                  key={c.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-card rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.005] transition-all border border-border/60"
                >
                  {/* Left: Avatar + Info */}
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-11 h-11 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center font-bold text-green-700 dark:text-green-400 text-base shrink-0 shadow-sm">
                      {(c.name?.[0] ?? "?").toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{c.name}</p>
                      <p className="text-xs text-muted-foreground font-mono truncate">{c.phone}</p>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        <Tags tags={c.tags || []} onClickTag={setTag} />
                        {c.created_at && (
                          <span className="text-[10px] text-muted-foreground/70">Added {fmtDate(c.created_at)}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Stage + Actions */}
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <Select value={c.stage ?? "new"} onValueChange={(v) => updateM.mutate({ id: c.id, updates: { stage: v as any } }, {
                      onError: (e) => toast({ title: "Update failed", description: String((e as any)?.message || e), variant: "destructive" })
                    })}>
                      <SelectTrigger className="h-7 w-[120px] text-xs rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {stages.map((s) => <SelectItem key={s} value={s}>{stageLabels[s]}</SelectItem>)}
                      </SelectContent>
                    </Select>

                    <Dialog open={editContact?.id === c.id} onOpenChange={(v) => !v && setEditContact(null)}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 px-3 text-xs rounded-xl hover:bg-muted/80 transition-colors" onClick={() => setEditContact(c)}>
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-lg">
                        <DialogHeader><DialogTitle>Edit Contact</DialogTitle></DialogHeader>
                        {editContact && (
                          <ContactEditor mode="edit" initial={editContact} saving={updateM.isPending}
                            onSave={(data) => updateM.mutate({ id: editContact.id as any, updates: data as any }, {
                              onSuccess: () => { toast({ title: "Saved" }); setEditContact(null); },
                              onError: (e) => toast({ title: "Failed", description: String((e as any)?.message || e), variant: "destructive" }),
                            })} />
                        )}
                      </DialogContent>
                    </Dialog>

                    <Link href="/inbox"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 text-xs font-semibold transition-colors shadow-sm">
                      <MessageSquareText className="h-3.5 w-3.5" /> Chat
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
