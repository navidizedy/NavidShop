import { ChevronDown, ChevronUp, Edit, Trash2 } from "lucide-react";
import type { Product, ProductVariant } from "@/types/product";
import { VariantTable } from "./VariantTable";
import { VariantModalType } from "../manage-products/useProductManagement";

interface ProductCardProps {
  product: Product;
  expanded: boolean;
  onToggleExpand: (productId: number) => void;
  onDelete: (p: Product) => void;
  onUpdate: (p: Product) => void;
  onVariantAction: (
    v: ProductVariant,
    type: VariantModalType,
    productId: number
  ) => void;
}

export function ProductCard({
  product,
  expanded,
  onToggleExpand,
  onDelete,
  onUpdate,
  onVariantAction,
}: ProductCardProps) {
  const categoryNames = product.categories?.length
    ? product.categories
        .map((c: any) => c.category?.name)
        .filter(Boolean)
        .join(", ")
    : "No categories";

  return (
    <div className="bg-gray-800 rounded-xl p-6 mb-4 shadow-lg border border-gray-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start md:items-center gap-5">
          <img
            src={product.images?.[0]?.url || "/placeholder.png"}
            alt={product.name}
            className="w-24 h-24 rounded-lg object-cover border border-gray-700"
          />
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold">{product.name}</h2>
            <p className="text-amber-500 text-sm font-medium">
              {categoryNames}
            </p>
            <p className="text-gray-400 text-sm line-clamp-2">
              {product.description || "No description."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onUpdate(product)}
            className="flex items-center gap-1 px-3 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-black text-sm font-bold"
          >
            <Edit size={16} /> Edit
          </button>
          <button
            onClick={() => onDelete(product)}
            className="flex items-center gap-1 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm font-bold"
          >
            <Trash2 size={16} /> Delete
          </button>
          <button
            onClick={() => onToggleExpand(product.id)}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600"
          >
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {expanded && (
        <VariantTable
          variants={product.variants ?? []}
          productId={product.id}
          onVariantAction={onVariantAction}
        />
      )}
    </div>
  );
}
