import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} from "@/services/category";

export function useCategories() {
  const queryClient = useQueryClient();

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,

    staleTime: Infinity,

    gcTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
  });

  const addCategoryMutation = useMutation({
    mutationFn: addCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return {
    ...categoriesQuery,
    addCategoryMutation,
    updateCategoryMutation,
    deleteCategoryMutation,
  };
}
