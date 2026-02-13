import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type PipelineContact = {
  id: number;
  name: string;
  phone: string;
  stage: string;
  created_at?: string | null;
  last_active?: string | null;
  tags?: string[];
};

export type PipelineResponse = Record<string, PipelineContact[]>;

export function usePipelineContacts() {
  return useQuery({
    queryKey: ["pipeline"],
    queryFn: async () => {
      // Backend: GET /api/pipeline
      const data = await api.get<PipelineResponse>("/api/pipeline");

      // data is an object: { New: [...], Contacted: [...], ... }
      return data || {};
    },
  });
}

export function useMovePipelineContact() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: { contactId: number; stage: string }) => {
      // Backend: POST /api/pipeline/move
      return api.post("/api/pipeline/move", {
        contactId: input.contactId,
        stage: input.stage,
      });
    },

    onMutate: async (vars) => {
      await qc.cancelQueries({ queryKey: ["pipeline"] });

      const prev = qc.getQueryData<PipelineResponse>(["pipeline"]);

      qc.setQueryData<PipelineResponse>(["pipeline"], (old) => {
        if (!old) return old;

        const next: PipelineResponse = structuredClone(old);

        // remove contact from all stages
        let moved: PipelineContact | null = null;

        Object.keys(next).forEach((stage) => {
          const idx = next[stage].findIndex((c) => c.id === vars.contactId);
          if (idx !== -1) {
            moved = next[stage][idx];
            next[stage].splice(idx, 1);
          }
        });

        // add to new stage
        if (moved) {
          moved.stage = vars.stage;
          if (!next[vars.stage]) next[vars.stage] = [];
          next[vars.stage].unshift(moved);
        }

        return next;
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
