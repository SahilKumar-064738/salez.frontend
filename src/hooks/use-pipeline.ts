/**
 * src/hooks/use-pipeline.ts
 *
 * Backend contract:
 *   GET  /api/v1/contacts?stage=<stage>  — contacts filtered by stage
 *   PUT  /api/v1/contacts/:id            — update contact stage
 *   GET  /api/v1/contacts/pipeline-stats — pipeline counts per stage
 *
 * The old /api/pipeline and /api/pipeline/move endpoints do not exist.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { contactsService } from "@/services/contactsService";

const STAGES = ["new", "contacted", "qualified", "converted", "lost"] as const;
export type PipelineStage = (typeof STAGES)[number];

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

/** Loads all contacts grouped by stage */
export function usePipelineContacts() {
  return useQuery({
    queryKey: ["pipeline"],
    queryFn: async (): Promise<PipelineResponse> => {
      const result = await contactsService.list({ limit: 100 });
      const grouped: PipelineResponse = {};

      for (const stage of STAGES) {
        grouped[stage] = [];
      }

      for (const c of result.contacts) {
        const stage = (c.stage ?? "new").toLowerCase();
        if (!grouped[stage]) grouped[stage] = [];
        grouped[stage].push({
          id: c.id,
          name: c.name,
          phone: c.phone,
          stage,
          created_at: c.created_at ?? null,
          last_active: c.last_active ?? null,
          tags: c.tags ?? [],
        });
      }

      return grouped;
    },
  });
}

/** Moves a contact to a new stage via PUT /api/v1/contacts/:id */
export function useMovePipelineContact() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: { contactId: number; stage: string }) => {
      return contactsService.update(input.contactId, { stage: input.stage });
    },

    // Optimistic update
    onMutate: async (vars) => {
      await qc.cancelQueries({ queryKey: ["pipeline"] });
      const prev = qc.getQueryData<PipelineResponse>(["pipeline"]);

      qc.setQueryData<PipelineResponse>(["pipeline"], (old) => {
        if (!old) return old;
        const next: PipelineResponse = structuredClone(old);
        let moved: PipelineContact | null = null;

        Object.keys(next).forEach((stage) => {
          const idx = next[stage].findIndex((c) => c.id === vars.contactId);
          if (idx !== -1) {
            moved = next[stage][idx];
            next[stage].splice(idx, 1);
          }
        });

        if (moved) {
          (moved as PipelineContact).stage = vars.stage;
          if (!next[vars.stage]) next[vars.stage] = [];
          next[vars.stage].unshift(moved as PipelineContact);
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
