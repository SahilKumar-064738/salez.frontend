import * as React from "react";

export type ImportStatus = "idle" | "importing" | "done" | "error";

export interface ImportState {
  status: ImportStatus;
  progress: number;
  total: number;
  created: number;
  failed: number;
  label: string;
}

interface ImportContextType {
  importState: ImportState;
  startImport: (contacts: { name: string; phone: string }[]) => void;
  clearImport: () => void;
}

const defaultState: ImportState = {
  status: "idle",
  progress: 0,
  total: 0,
  created: 0,
  failed: 0,
  label: "",
};

const ImportContext = React.createContext<ImportContextType | null>(null);

export function ImportProvider({ children }: { children: React.ReactNode }) {
  const [importState, setImportState] = React.useState<ImportState>(defaultState);
  const workerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearImport = React.useCallback(() => {
    if (workerRef.current) clearTimeout(workerRef.current);
    setImportState(defaultState);
  }, []);

  const startImport = React.useCallback(
    (contacts: { name: string; phone: string }[]) => {
      setImportState({
        status: "importing",
        progress: 0,
        total: contacts.length,
        created: 0,
        failed: 0,
        label: `Importing ${contacts.length} contacts…`,
      });

      // Simulate progress ticks until API resolves
      // Real progress comes from bulkCreate result fed back via finishImport
      let tick = 0;
      const maxFakePct = 85;
      const interval = setInterval(() => {
        tick += 1;
        const pct = Math.min(maxFakePct, Math.round((tick / 20) * maxFakePct));
        setImportState((prev) => {
          if (prev.status !== "importing") {
            clearInterval(interval);
            return prev;
          }
          return { ...prev, progress: pct };
        });
        if (tick >= 20) clearInterval(interval);
      }, 300);

      workerRef.current = interval as unknown as ReturnType<typeof setTimeout>;
    },
    []
  );

  // Exposed so ContactsPage can call after API resolves
  const finishImport = React.useCallback(
    (created: number, failed: number) => {
      if (workerRef.current) clearInterval(workerRef.current as unknown as ReturnType<typeof setInterval>);
      setImportState((prev) => ({
        ...prev,
        status: "done",
        progress: 100,
        created,
        failed,
        label: `${created} contact${created !== 1 ? "s" : ""} imported!`,
      }));
      setTimeout(() => {
        setImportState(defaultState);
      }, 4000);
    },
    []
  );

  const value = React.useMemo(
    () => ({ importState, startImport, clearImport, finishImport }),
    [importState, startImport, clearImport, finishImport]
  ) as ImportContextType & { finishImport: typeof finishImport };

  return <ImportContext.Provider value={value}>{children}</ImportContext.Provider>;
}

export function useImport() {
  const ctx = React.useContext(ImportContext);
  if (!ctx) throw new Error("useImport must be used within ImportProvider");
  return ctx as ImportContextType & {
    finishImport: (created: number, failed: number) => void;
  };
}
