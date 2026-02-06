import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function usePipelineContacts() {
  return useQuery({
    queryKey: [api.pipeline.list.path],
    queryFn: async () => {
      const res = await fetch(api.pipeline.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch pipeline");
      const json = await res.json();
      return parseWithLogging(api.pipeline.list.responses[200], json, "pipeline.list");
    },
  });
}

export function useMovePipelineContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, stage }: { id: number; stage: z.infer<typeof api.pipeline.move.input>["stage"] }) => {
      const url = buildUrl(api.pipeline.move.path, { id });
      const validated = api.pipeline.move.input.parse({ stage });
      const res = await fetch(url, {
        method: api.pipeline.move.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const err = parseWithLogging(api.pipeline.move.responses[400], await res.json(), "pipeline.move.400");
          throw new Error(err.message);
        }
        if (res.status === 404) {
          const err = parseWithLogging(api.pipeline.move.responses[404], await res.json(), "pipeline.move.404");
          throw new Error(err.message);
        }
        throw new Error("Failed to move contact");
      }
      const json = await res.json();
      return parseWithLogging(api.pipeline.move.responses[200], json, "pipeline.move.200");
    },
    onMutate: async (vars) => {
      await qc.cancelQueries({ queryKey: [api.pipeline.list.path] });
      const prev = qc.getQueryData<unknown>([api.pipeline.list.path]);
      qc.setQueryData([api.pipeline.list.path], (old: any) => {
        if (!Array.isArray(old)) return old;
        return old.map((c) => (c?.id === vars.id ? { ...c, stage: vars.stage } : c));
      });
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData([api.pipeline.list.path], ctx.prev);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [api.pipeline.list.path] });
      qc.invalidateQueries({ queryKey: [api.contacts.list.path] });
      qc.invalidateQueries({ queryKey: [api.inbox.listConversations.path] });
    },
  });
}
