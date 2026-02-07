import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type PipelineContact = {
  id: number;
  name: string;
  phone: string;
  stage: string;
  last_active?: string | null;
  tags?: string[];
};

export function usePipelineContacts() {
  return useQuery({
    queryKey: ["pipeline"],
    queryFn: async () => {
      // Backend: GET /api/pipeline
      const data = await api.get<any>("/api/pipeline");

      // backend might return { contacts: [] } OR [] depending on implementation
      const list = Array.isArray(data) ? data : data?.contacts || data?.pipeline || [];

      return (list as any[]).map((c) => ({
        id: c.id,
        name: c.name ?? "Unnamed",
        phone: c.phone ?? "",
        stage: c.stage ?? "New",
        last_active: c.last_active ?? null,
        tags: c.tags ?? [],
      })) as PipelineContact[];
    },
  });
}

export function useMovePipelineContact() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: { id: number; stage: string }) => {
      // Backend: PUT /api/contacts/:id
      // Because pipeline stages are stored in contacts table
      return api.put(`/api/contacts/${input.id}`, { stage: input.stage });
    },

    // Optimistic update
    onMutate: async (vars) => {
      await qc.cancelQueries({ queryKey: ["pipeline"] });

      const prev = qc.getQueryData<any[]>(["pipeline"]);

      qc.setQueryData(["pipeline"], (old: any) => {
        if (!Array.isArray(old)) return old;
        return old.map((c) => (c?.id === vars.id ? { ...c, stage: vars.stage } : c));
      });

      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["pipeline"], ctx.prev);
    },

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pipeline"] });
      qc.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}
