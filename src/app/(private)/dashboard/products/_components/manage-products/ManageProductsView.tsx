"use client";

import { Toaster } from "react-hot-toast";

import Pagination from "@/components/Pagination";
import ProductDeleteModal from "../ProductDeleteModal";
import ProductUpdateModal from "../ProductUpdateModal";
import { useProductManagement } from "./useProductManagement";
import VariantUpdateModal from "../VariantUpdateModal";
import VariantDeleteModal from "../VariantDeleteModal";

import { ProductCard } from "./ProductCard";
import VariantAddModal from "./VariantAddModal";

export default function ManageProductsView() {
  const {
    productList,
    totalPages,
    currentPage,
    isLoading,
    isFetching,
    error,
    expandedId,
    productModal,
    variantModal,
    handleToggleExpand,
    handlePageChange,
  } = useProductManagement();

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-400">
        <div className="text-center">
          <p className="text-xl font-semibold">Failed to load products.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-sm underline text-gray-400 hover:text-white"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <>
      <Toaster />

      <ProductDeleteModal
        isOpen={productModal.type === "delete"}
        onClose={productModal.onClose}
        productId={productModal.selected?.id ?? null}
        productName={productModal.selected?.name ?? ""}
      />
      {productModal.selected && (
        <ProductUpdateModal
          isOpen={productModal.type === "update"}
          onClose={productModal.onClose}
          product={productModal.selected}
        />
      )}

      {variantModal.productId != null && (
        <>
          {variantModal.selected && (
            <>
              <VariantUpdateModal
                isOpen={variantModal.type === "update"}
                onClose={variantModal.onClose}
                productId={variantModal.productId}
                variant={variantModal.selected as any}
              />
              <VariantDeleteModal
                isOpen={variantModal.type === "delete"}
                onClose={variantModal.onClose}
                productId={variantModal.productId}
                variantId={variantModal.selected.id!}
              />
            </>
          )}

          <VariantAddModal
            isOpen={variantModal.type === "add"}
            onClose={variantModal.onClose}
            productId={variantModal.productId!}
            existingVariants={
              productList?.find((p) => p.id === variantModal.productId)
                ?.variants || []
            }
          />
        </>
      )}

      <div className="min-h-screen p-8 bg-gray-900 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Manage Products
            </h1>
            <div className="flex items-center gap-1 mt-1">
              {isLoading ? (
                <div className="h-4 w-32 bg-gray-800 animate-pulse rounded" />
              ) : (
                <p className="text-gray-400 text-sm">
                  Showing page{" "}
                  <span className="text-white font-medium">{currentPage}</span>{" "}
                  of{" "}
                  <span className="text-white font-medium">{totalPages}</span>
                  {isFetching && (
                    <span className="ml-2 text-[10px] text-blue-400 animate-pulse">
                      Updating...
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-800 rounded-xl p-6 h-48 border border-gray-700"
              />
            ))}
          </div>
        ) : !productList || productList.length === 0 ? (
          <div className="bg-gray-800/50 rounded-xl p-20 text-center text-gray-400 border border-dashed border-gray-700">
            No products found for this selection.
          </div>
        ) : (
          <div
            className={`space-y-4 transition-opacity duration-300 ${
              isFetching ? "opacity-60" : "opacity-100"
            }`}
          >
            {productList.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                expanded={expandedId === product.id}
                onToggleExpand={handleToggleExpand}
                onDelete={productModal.onDelete}
                onUpdate={productModal.onUpdate}
                onVariantAction={variantModal.onAction}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-12 mb-10 border-t border-gray-800 pt-10">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              variant="dark"
            />
          </div>
        )}
      </div>
    </>
  );
}
