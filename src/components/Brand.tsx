import * as React from "react";
import { MessageCircleMore } from "lucide-react";
import { cn } from "@/lib/utils";

export function Brand({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)} data-testid="brand">
      <div
        className="relative grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/15 ring-1 ring-border shadow-sm"
        aria-hidden="true"
      >
        <div className="absolute inset-0 rounded-2xl grain opacity-70" />
        <MessageCircleMore className="relative h-5 w-5 text-primary" />
      </div>
      {!compact && (
        <div className="leading-tight">
          <div className="text-sm font-semibold tracking-tight">Lumen CRM</div>
          <div className="text-xs text-muted-foreground">Inbox-first messaging</div>
        </div>
      )}
    </div>
  );
}
