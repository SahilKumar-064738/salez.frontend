import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type Template = {
  id: number;
  business_id: number;
  name: string;
  content: string;
  category?: string | null;
  created_at?: string;
};

export function useTemplates() {
  return useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      // Backend: GET /api/templates (should return array)
      const data = await api.get<any[]>("/api/templates");
      return (data || []) as Template[];
    },
  });
}

export function useCreateTemplate() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      name: string;
      content: string;
      category?: string | null;
    }) => {
      // Backend: POST /api/templates
      return api.post<Template>("/api/templates", {
        name: input.name,
        content: input.content,
        category: input.category ?? null,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["templates"] });
    },
  });
}

export function useUpdateTemplate() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      id: number;
      updates: Partial<{
        name: string;
        content: string;
        category: string | null;
      }>;
    }) => {
      // Backend: PUT /api/templates/:id
      return api.put<Template>(`/api/templates/${input.id}`, input.updates);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["templates"] });
    },
  });
}

export function useDeleteTemplate() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      // Backend: DELETE /api/templates/:id
      return api.delete(`/api/templates/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["templates"] });
    },
  });
}
