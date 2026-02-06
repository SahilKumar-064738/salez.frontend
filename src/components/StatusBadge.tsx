import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const map: Record<string, string> = {
  Pending: "bg-muted text-muted-foreground border-muted/30",
  Approved: "bg-chart-4/12 text-chart-4 border-chart-4/20",
  Rejected: "bg-destructive/12 text-destructive border-destructive/20",
  Draft: "bg-muted text-muted-foreground border-muted/30",
  Scheduled: "bg-chart-3/12 text-chart-3 border-chart-3/20",
  Running: "bg-primary/12 text-primary border-primary/20",
  Paused: "bg-accent/15 text-accent-foreground border-accent/25",
  Completed: "bg-chart-4/12 text-chart-4 border-chart-4/20",
};

export function StatusBadge({ value, className }: { value: string; className?: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-tight",
        map[value] ?? "bg-muted text-muted-foreground border-muted/30",
        className,
      )}
      data-testid={`status-badge-${value}`}
    >
      {value}
    </Badge>
  );
}
