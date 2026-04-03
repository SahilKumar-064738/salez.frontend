import * as React from "react";
import { Loader2, CheckCircle2, X } from "lucide-react";
import { useImport } from "@/context/ImportContext";
import { cn } from "@/lib/utils";

export function ImportProgressWidget() {
  const { importState, clearImport } = useImport();

  if (importState.status === "idle") return null;

  const isDone = importState.status === "done";

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-[9999] w-72 rounded-2xl shadow-2xl border bg-card text-card-foreground p-4 transition-all duration-300",
        isDone ? "border-emerald-300 bg-emerald-50 dark:bg-emerald-950 dark:border-emerald-700" : "border-border"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          {isDone ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
          ) : (
            <Loader2 className="h-5 w-5 text-primary animate-spin shrink-0" />
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">
              {isDone ? "Import Complete" : "Importing Contacts"}
            </p>
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {importState.label}
            </p>
          </div>
        </div>
        {isDone && (
          <button
            onClick={clearImport}
            className="shrink-0 rounded-md p-1 hover:bg-muted transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>

      <div className="mt-3">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>{importState.progress}%</span>
          {importState.total > 0 && (
            <span>
              {isDone
                ? `${importState.created} imported${importState.failed > 0 ? `, ${importState.failed} skipped` : ""}`
                : `${importState.total} contacts`}
            </span>
          )}
        </div>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              isDone ? "bg-emerald-500" : "bg-primary"
            )}
            style={{ width: `${importState.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
