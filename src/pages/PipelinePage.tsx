import * as React from "react";
import { Link } from "wouter";
import type { Contact, Stage } from "@shared/schema";
import { stages } from "@shared/schema";
import { usePipelineContacts, useMovePipelineContact } from "@/hooks/use-pipeline";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StageBadge } from "@/components/StageBadge";
import { cn } from "@/lib/utils";
import { Loader2, RotateCcw, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type DragState = { contactId: number; from: Stage } | null;

export default function PipelinePage() {
  const { toast } = useToast();
  const q = usePipelineContacts();
  const moveM = useMovePipelineContact();

  const [drag, setDrag] = React.useState<DragState>(null);

  const contacts = (q.data || []) as unknown as Contact[];

  const columns = React.useMemo(() => {
    const map = new Map<Stage, Contact[]>();
    stages.forEach((s) => map.set(s, []));
    contacts.forEach((c: any) => {
      const s = (c.stage || "New") as Stage;
      if (!map.has(s)) map.set(s, []);
      map.get(s)!.push(c);
    });
    stages.forEach((s) => map.set(s, (map.get(s) || []).sort((a: any, b: any) => (a.lastActiveAt < b.lastActiveAt ? 1 : -1))));
    return map;
  }, [contacts]);

  const onDropStage = (stage: Stage) => {
    if (!drag) return;
    if (drag.from === stage) return;

    const contact = contacts.find((c: any) => c.id === drag.contactId) as any;
    const prevStage = drag.from;

    moveM.mutate(
      { id: drag.contactId, stage },
      {
        onSuccess: () => {
          toast({
            title: "Moved",
            description: `${contact?.name || "Lead"} → ${stage}`,
            action: (
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => {
                  moveM.mutate(
                    { id: drag.contactId, stage: prevStage },
                    {
                      onError: (e) =>
                        toast({ title: "Undo failed", description: String(e.message || e), variant: "destructive" }),
                    },
                  );
                }}
                data-testid="pipeline-undo"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Undo
              </Button>
            ) as any,
          });
        },
        onError: (e) => toast({ title: "Move failed", description: String(e.message || e), variant: "destructive" }),
      },
    );
  };

  return (
    <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 py-6 rise-in" data-testid="page-pipeline">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl">Sales Pipeline</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Trello-like stages. Drag leads across columns with optimistic UI + undo.
          </p>
        </div>
        <Button variant="outline" className="rounded-xl" onClick={() => q.refetch()} data-testid="pipeline-refresh">
          Refresh
        </Button>
      </div>

      <div className="mt-5">
        {q.isLoading ? (
          <Card className="surface-glass rounded-2xl p-8 text-sm text-muted-foreground" data-testid="pipeline-loading">
            <Loader2 className="inline-block h-4 w-4 animate-spin mr-2" />
            Loading pipeline…
          </Card>
        ) : q.isError ? (
          <Card className="surface-glass rounded-2xl p-8 text-sm text-destructive" data-testid="pipeline-error">
            Failed to load pipeline. ({String((q.error as any)?.message || q.error)})
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
            {stages.map((s) => {
              const items = columns.get(s) || [];
              return (
                <div
                  key={s}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => onDropStage(s)}
                  className={cn(
                    "rounded-2xl border border-card-border bg-card/60 backdrop-blur p-3 shadow-sm min-h-[220px]",
                    "transition-all duration-200",
                  )}
                  data-testid={`pipeline-col-${s}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <StageBadge stage={s} />
                      <div className="text-sm font-semibold">{s}</div>
                    </div>
                    <div className="text-xs text-muted-foreground" data-testid={`pipeline-count-${s}`}>
                      {items.length}
                    </div>
                  </div>

                  <div className="mt-3 space-y-2">
                    {items.map((c: any) => (
                      <div
                        key={c.id}
                        draggable
                        onDragStart={() => setDrag({ contactId: c.id, from: c.stage })}
                        onDragEnd={() => setDrag(null)}
                        className={cn(
                          "rounded-2xl border border-card-border bg-gradient-to-br from-card to-muted/30 p-3 shadow-sm",
                          "hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-grab active:cursor-grabbing",
                        )}
                        data-testid={`pipeline-card-${c.id}`}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="truncate font-semibold">{c.name}</div>
                            <div className="mt-1 text-xs text-muted-foreground truncate">{c.phone}</div>
                          </div>
                          <Sparkles className="h-4 w-4 text-primary/70" />
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-2">
                          <div className="text-[11px] text-muted-foreground">
                            {(c.tags || []).slice(0, 2).join(" · ") || "—"}
                          </div>
                          <Link
                            href="/inbox"
                            className="text-[11px] font-semibold text-primary hover:underline"
                            data-testid={`pipeline-open-inbox-${c.id}`}
                          >
                            Open chat
                          </Link>
                        </div>
                      </div>
                    ))}

                    {items.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-border bg-background/30 p-3 text-xs text-muted-foreground">
                        Drop leads here.
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
