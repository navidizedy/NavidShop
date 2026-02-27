import { useMemo } from "react";
import {
  getAllProducts,
  addProduct,
  getProductById,
  deleteProduct,
  updateProduct,
  updateVariant,
  deleteVariant,
} from "@/services/product";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";

import type { Product, ProductInput, ProductVariant } from "@/types/product";

interface ProductFilters {
  categories?: string[];
  colors?: string[];
  sizes?: string[];
  sort?: "most-popular" | "lowest-price" | "highest-price" | "newest";
  page?: number;
  limit?: number;
}

interface ProductsResponse {
  message: string;
  data: Product[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function useProducts(filters?: ProductFilters) {
  const queryClient = useQueryClient();

  const normalizedFilters = useMemo(
    () => ({
      page: filters?.page ?? 1,
      limit: filters?.limit ?? 12,
      sort: filters?.sort ?? "newest",
      categories: filters?.categories ?? [],
      colors: filters?.colors ?? [],
      sizes: filters?.sizes ?? [],
    }),
    [JSON.stringify(filters)],
  );

  const productsQuery = useQuery<ProductsResponse>({
    queryKey: ["products", normalizedFilters],
    queryFn: () => getAllProducts(normalizedFilters),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  });

  const useProductQuery = (id: number) =>
    useQuery({
      queryKey: ["product", id],
      queryFn: () => getProductById(id),
      enabled: !!id,
    });

  const addProductMutation = useMutation({
    mutationFn: (product: ProductInput) => addProduct(product),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  const updateProductMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: FormData | Partial<ProductInput>;
    }) => updateProduct(id, data),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", vars.id] });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  const updateVariantMutation = useMutation({
    mutationFn: ({
      productId,
      variantId,
      data,
    }: {
      productId: number;
      variantId: number;
      data: Partial<ProductVariant>;
    }) => updateVariant(productId, variantId, data),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", vars.productId] });
    },
  });

  const deleteVariantMutation = useMutation({
    mutationFn: ({
      productId,
      variantId,
    }: {
      productId: number;
      variantId: number;
    }) => deleteVariant(productId, variantId),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", vars.productId] });
    },
  });

  return {
    data: productsQuery.data?.data ?? [],
    meta: productsQuery.data?.meta,
    isLoading: productsQuery.isLoading,
    error: productsQuery.error,
    productsQuery,
    useProductQuery,
    addProductMutation,
    deleteProductMutation,
    updateProductMutation,
    updateVariantMutation,
    deleteVariantMutation,
  };
}
