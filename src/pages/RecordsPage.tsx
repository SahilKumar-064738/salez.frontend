import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import {
  Plus, Loader2, Search, Bell, Trash2, Calendar, Phone, FileText, Clock, AlertTriangle, CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ServiceType = "GST" | "ITR" | "TDS" | "ROC" | "Other";

interface Record {
  id: number;
  client_name: string;
  phone: string;
  service_type: ServiceType;
  due_date: string;
  reminder_days_before: number;
  created_at: string;
  status?: "upcoming" | "due_soon" | "overdue";
}

const SERVICE_TYPES: ServiceType[] = ["GST", "ITR", "TDS", "ROC", "Other"];

function getDaysUntilDue(dueDateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDateStr);
  due.setHours(0, 0, 0, 0);
  return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function getRecordStatus(record: Record): "upcoming" | "due_soon" | "overdue" {
  const days = getDaysUntilDue(record.due_date);
  if (days < 0) return "overdue";
  if (days <= record.reminder_days_before) return "due_soon";
  return "upcoming";
}

function StatusBadge({ status }: { status: string }) {
  if (status === "overdue") return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2.5 py-0.5 text-[11px] font-semibold">
      <AlertTriangle className="h-3 w-3" /> Overdue
    </span>
  );
  if (status === "due_soon") return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2.5 py-0.5 text-[11px] font-semibold">
      <Bell className="h-3 w-3" /> Due Soon
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2.5 py-0.5 text-[11px] font-semibold">
      <CheckCircle2 className="h-3 w-3" /> Upcoming
    </span>
  );
}

function ServiceBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    GST: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
    ITR: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
    TDS: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400",
    ROC: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400",
    Other: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
  };
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold", colors[type] || colors.Other)}>
      {type}
    </span>
  );
}

function RecordForm({ onSave, onClose, saving }: {
  onSave: (data: Omit<Record, "id" | "created_at" | "status">) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const [clientName, setClientName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [serviceType, setServiceType] = React.useState<ServiceType>("GST");
  const [dueDate, setDueDate] = React.useState("");
  const [reminderDays, setReminderDays] = React.useState(3);

  const isValid = clientName.trim() && phone.trim() && dueDate;

  return (
    <div className="space-y-4 py-2">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-muted-foreground">Client Name *</label>
          <Input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Ramesh Kumar" className="mt-1 rounded-xl" />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground">Phone *</label>
          <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 99999 99999" className="mt-1 rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-muted-foreground">Service Type</label>
          <Select value={serviceType} onValueChange={v => setServiceType(v as ServiceType)}>
            <SelectTrigger className="mt-1 rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              {SERVICE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground">Due Date *</label>
          <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="mt-1 rounded-xl" />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-muted-foreground">
          Reminder Days Before Due <span className="text-primary font-bold">{reminderDays} days</span>
        </label>
        <input
          type="range" min={1} max={30} value={reminderDays}
          onChange={e => setReminderDays(Number(e.target.value))}
          className="mt-2 w-full accent-primary"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
          <span>1 day</span><span>30 days</span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1.5 bg-muted/50 rounded-lg px-3 py-2">
          📲 WhatsApp reminder will be sent <strong>{reminderDays} days before</strong> the due date automatically.
        </p>
      </div>

      <div className="flex gap-2 pt-1">
        <Button variant="outline" onClick={onClose} className="flex-1 rounded-xl">Cancel</Button>
        <Button
          onClick={() => onSave({ client_name: clientName, phone, service_type: serviceType, due_date: dueDate, reminder_days_before: reminderDays })}
          disabled={saving || !isValid}
          className="flex-1 rounded-xl bg-green-600 hover:bg-green-700 shadow-md"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
          Add Record
        </Button>
      </div>
    </div>
  );
}

export default function RecordsPage() {
  const { toast } = useToast();
  const [records, setRecords] = React.useState<Record[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState<number | null>(null);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [filterService, setFilterService] = React.useState<string>("all");
  const [filterStatus, setFilterStatus] = React.useState<string>("all");

  const fetchRecords = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<any>("/api/v1/records");
      const data = (res as any)?.data || res || [];
      setRecords(Array.isArray(data) ? data : []);
    } catch {
      // If endpoint not yet available, start with empty state
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { fetchRecords(); }, [fetchRecords]);

  const handleCreate = async (data: Omit<Record, "id" | "created_at" | "status">) => {
    setSaving(true);
    try {
      await api.post("/api/v1/records", data);
      toast({ title: "Record added", description: `Reminder set for ${data.reminder_days_before} days before due date.` });
      setCreateOpen(false);
      fetchRecords();
    } catch {
      toast({ title: "Failed to add record", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeleting(id);
    try {
      await api.delete(`/api/v1/records/${id}`);
      toast({ title: "Record deleted" });
      setRecords(prev => prev.filter(r => r.id !== id));
    } catch {
      toast({ title: "Failed to delete", variant: "destructive" });
    } finally {
      setDeleting(null);
    }
  };

  const enriched = records.map(r => ({ ...r, status: getRecordStatus(r) }));

  const filtered = enriched.filter(r => {
    const matchSearch = !search || r.client_name.toLowerCase().includes(search.toLowerCase()) || r.phone.includes(search);
    const matchService = filterService === "all" || r.service_type === filterService;
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    return matchSearch && matchService && matchStatus;
  });

  const counts = {
    total: enriched.length,
    overdue: enriched.filter(r => r.status === "overdue").length,
    due_soon: enriched.filter(r => r.status === "due_soon").length,
    upcoming: enriched.filter(r => r.status === "upcoming").length,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-5" data-testid="page-records">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" /> Client Records
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track GST / ITR filing deadlines with automatic WhatsApp reminders.
          </p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 rounded-xl bg-green-600 hover:bg-green-700 shadow-md hover:scale-105 transition-all">
              <Plus className="h-4 w-4" /> Add Record
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>Add Client Record</DialogTitle></DialogHeader>
            <RecordForm onSave={handleCreate} onClose={() => setCreateOpen(false)} saving={saving} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Records", value: counts.total, icon: FileText, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { label: "Overdue", value: counts.overdue, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" },
          { label: "Due Soon", value: counts.due_soon, icon: Bell, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
          { label: "Upcoming", value: counts.upcoming, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
        ].map(stat => (
          <Card key={stat.label} className={cn("p-4 rounded-2xl border shadow-sm", stat.bg)}>
            <div className="flex items-center gap-3">
              <stat.icon className={cn("h-5 w-5", stat.color)} />
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Reminder info banner */}
      <div className="rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 px-5 py-3 flex items-center gap-3">
        <Bell className="h-4 w-4 text-blue-500 shrink-0" />
        <p className="text-xs text-blue-700 dark:text-blue-300">
          <strong>Auto Reminder System:</strong> WhatsApp messages are sent daily at 9:00 AM for clients whose due date matches their reminder schedule.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[160px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search client or phone…" className="pl-8 h-9 text-sm rounded-xl" />
        </div>
        <Select value={filterService} onValueChange={setFilterService}>
          <SelectTrigger className="w-[130px] h-9 text-sm rounded-xl"><SelectValue placeholder="Service" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All services</SelectItem>
            {SERVICE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[130px] h-9 text-sm rounded-xl"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="due_soon">Due Soon</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileText className="h-10 w-10 text-muted-foreground/30 mx-auto" />
            <p className="text-sm text-muted-foreground">
              {records.length === 0 ? "No records yet. Add your first client record." : "No records match your filters."}
            </p>
            {records.length === 0 && (
              <Button size="sm" className="rounded-xl" onClick={() => setCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-1" /> Add First Record
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead className="min-w-[160px]">Client Name</TableHead>
                  <TableHead className="min-w-[130px]">Phone</TableHead>
                  <TableHead className="min-w-[100px]">Service</TableHead>
                  <TableHead className="min-w-[120px]">Due Date</TableHead>
                  <TableHead className="min-w-[120px]">Reminder</TableHead>
                  <TableHead className="min-w-[110px]">Status</TableHead>
                  <TableHead className="min-w-[80px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(r => {
                  const days = getDaysUntilDue(r.due_date);
                  return (
                    <TableRow key={r.id} className={cn(
                      "hover:bg-muted/20",
                      r.status === "overdue" && "bg-red-50/50 dark:bg-red-900/10",
                      r.status === "due_soon" && "bg-amber-50/50 dark:bg-amber-900/10",
                    )}>
                      <TableCell className="font-semibold text-sm">{r.client_name}</TableCell>
                      <TableCell className="text-sm font-mono text-muted-foreground">
                        <a href={`https://wa.me/${r.phone.replace(/\D/g,"")}`} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 hover:text-green-600 transition-colors">
                          <Phone className="h-3 w-3" />{r.phone}
                        </a>
                      </TableCell>
                      <TableCell><ServiceBadge type={r.service_type} /></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          {new Date(r.due_date).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {days === 0 ? "Due today!" : days > 0 ? `${days} days left` : `${Math.abs(days)} days ago`}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" /> {r.reminder_days_before} days before
                        </div>
                      </TableCell>
                      <TableCell><StatusBadge status={r.status!} /></TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost" size="icon"
                          className="h-7 w-7 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(r.id)}
                          disabled={deleting === r.id}
                        >
                          {deleting === r.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}
