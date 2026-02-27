import {
  addColor,
  deleteColor,
  getAllColors,
  updateColor,
} from "@/services/color";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useColors() {
  const queryClient = useQueryClient();

  const getColors = useQuery({
    queryKey: ["colors"],
    queryFn: getAllColors,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
  });

  const addColorMutation = useMutation({
    mutationFn: addColor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colors"] });
    },
  });

  const updateColorMutation = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      updateColor(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colors"] });
    },
  });

  const deleteColorMutation = useMutation({
    mutationFn: (id: number) => deleteColor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colors"] });
    },
  });

  return {
    ...getColors,
    addColorMutation,
    deleteColorMutation,
    updateColorMutation,
  };
}
