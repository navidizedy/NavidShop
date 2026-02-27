import { useState, useMemo, useCallback } from "react";
import { useProducts } from "@/hooks/useProducts";
import type { Product, ProductVariant } from "@/types/product";

type VariantModalType = "update" | "delete" | "add";

type SelectedVariantType = Partial<ProductVariant> & {
  oldPrice?: number;
  discount?: number;
};

export const useProductManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const {
    data: productList,
    meta,
    isLoading,
    error,
    productsQuery,
  } = useProducts({
    page: currentPage,
    limit: PAGE_SIZE,
  });

  const isFetching = productsQuery.isFetching;

  const totalPages = useMemo(() => meta?.totalPages ?? 1, [meta]);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const [productModalType, setProductModalType] = useState<
    "update" | "delete" | null
  >(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [variantModalType, setVariantModalType] =
    useState<VariantModalType | null>(null);
  const [selectedVariant, setSelectedVariant] =
    useState<SelectedVariantType | null>(null);
  const [variantProductId, setVariantProductId] = useState<number | null>(null);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    setExpandedId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleToggleExpand = useCallback((productId: number) => {
    setExpandedId((prevId) => (prevId === productId ? null : productId));
  }, []);

  const handleOpenProductDelete = useCallback((product: Product) => {
    setSelectedProduct(product);
    setProductModalType("delete");
  }, []);

  const handleOpenProductUpdate = useCallback((product: Product) => {
    setSelectedProduct(product);
    setProductModalType("update");
  }, []);

  const handleCloseProductModal = useCallback(() => {
    setProductModalType(null);
    setSelectedProduct(null);
  }, []);

  const handleOpenVariantModal = useCallback(
    (variant: any, type: VariantModalType, productId: number) => {
      setSelectedVariant(variant);
      setVariantProductId(productId);
      setVariantModalType(type);
    },
    [],
  );

  const handleCloseVariantModal = useCallback(() => {
    setVariantModalType(null);
    setSelectedVariant(null);
    setVariantProductId(null);
  }, []);

  return {
    productList,
    totalPages,
    currentPage,
    isLoading,
    isFetching,
    error,
    handlePageChange,
    expandedId,
    productModal: {
      type: productModalType,
      selected: selectedProduct,
      onClose: handleCloseProductModal,
      onDelete: handleOpenProductDelete,
      onUpdate: handleOpenProductUpdate,
    },
    variantModal: {
      type: variantModalType,
      selected: selectedVariant,
      productId: variantProductId,
      onClose: handleCloseVariantModal,
      onAction: handleOpenVariantModal,
    },
    handleToggleExpand,
  };
};

export type { VariantModalType, SelectedVariantType };
