import * as React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  hint,
  right,
  tone = "primary",
  "data-testid": testId,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  right?: React.ReactNode;
  tone?: "primary" | "accent" | "muted";
  "data-testid"?: string;
}) {
  const toneClass =
    tone === "primary"
      ? "from-primary/18 via-primary/8 to-transparent"
      : tone === "accent"
        ? "from-accent/20 via-accent/10 to-transparent"
        : "from-muted/70 via-muted/40 to-transparent";

  return (
    <Card
      className={cn(
        "relative overflow-hidden rounded-2xl border-card-border bg-card shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5",
      )}
      data-testid={testId}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br", toneClass)} />
      <div className="relative p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold tracking-wide text-muted-foreground">{label}</div>
            <div className="mt-2 text-2xl font-bold tracking-tight">{value}</div>
            {hint ? <div className="mt-1 text-xs text-muted-foreground">{hint}</div> : null}
          </div>
          {right ? <div className="mt-1">{right}</div> : null}
        </div>
      </div>
    </Card>
  );
}
