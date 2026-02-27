import { addSize, deleteSize, getAllSizes, updateSize } from "@/services/size";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useSizes() {
  const queryClient = useQueryClient();

  const getSizes = useQuery({
    queryKey: ["sizes"],
    queryFn: getAllSizes,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
  });

  const addSizeMutation = useMutation({
    mutationFn: addSize,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sizes"] });
    },
  });

  const updateSizeMutation = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      updateSize(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sizes"] });
    },
  });

  const deleteSizeMutation = useMutation({
    mutationFn: (id: number) => deleteSize(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sizes"] });
    },
  });

  return {
    ...getSizes,
    addSizeMutation,
    updateSizeMutation,
    deleteSizeMutation,
  };
}
