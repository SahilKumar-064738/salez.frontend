import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Stage } from "@shared/schema";
import { stageLabels } from "@shared/schema";

const stageStyles: Record<string, string> = {
  new:       "bg-primary/12 text-primary border-primary/20",
  contacted: "bg-chart-4/12 text-chart-4 border-chart-4/20",
  qualified: "bg-accent/15 text-accent-foreground border-accent/25",
  converted: "bg-chart-2/12 text-chart-2 border-chart-2/20",
  lost:      "bg-destructive/12 text-destructive border-destructive/20",
};

function label(stage: Stage | string): string {
  const s = String(stage).toLowerCase() as Stage;
  return stageLabels[s] ?? String(stage);
}

export function StageBadge({ stage, className }: { stage: Stage | string; className?: string }) {
  const s = String(stage).toLowerCase();
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-tight",
        stageStyles[s] ?? "bg-muted text-muted-foreground border-muted/30",
        className,
      )}
      data-testid={`stage-badge-${s}`}
    >
      {label(stage)}
    </Badge>
  );
}

export function StagePill({
  stage,
  size = "sm",
  className,
}: {
  stage: Stage | string;
  size?: "sm" | "md";
  className?: string;
}) {
  const s = String(stage).toLowerCase();
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-tight",
        stageStyles[s] ?? "bg-muted text-muted-foreground border-muted/30",
        size === "md" && "text-sm px-3.5 py-1.5",
        className,
      )}
      data-testid={`stage-pill-${s}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {label(stage)}
    </span>
  );
}
