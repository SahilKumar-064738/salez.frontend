import * as React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  "data-testid": testId,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  "data-testid"?: string;
}) {
  return (
    <Card
      className={cn(
        "rounded-2xl border-card-border bg-card/80 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/70",
        className,
      )}
      data-testid={testId}
    >
      <div className="p-8 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary/15 to-accent/10 ring-1 ring-border">
          {icon}
        </div>
        <h3 className="mt-4 text-lg">{title}</h3>
        {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
        {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
      </div>
    </Card>
  );
}
