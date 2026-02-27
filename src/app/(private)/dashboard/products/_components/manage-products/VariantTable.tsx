import type { ProductVariant } from "@/types/product";
import { VariantModalType } from "../manage-products/useProductManagement";
import { memo } from "react";
import { Plus } from "lucide-react";

interface VariantTableProps {
  variants: ProductVariant[];
  productId: number;
  onVariantAction: (
    v: ProductVariant,
    type: VariantModalType,
    productId: number,
  ) => void;
}

function VariantTableComponent({
  variants,
  productId,
  onVariantAction,
}: VariantTableProps) {
  return (
    <div className="mt-6 border-t border-gray-700 pt-4 overflow-x-auto">
      <div className="flex justify-between items-center mb-4 px-2">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
          Inventory Variants
        </h3>
        <button
          onClick={() => onVariantAction({} as any, "add", productId)}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-xs font-bold transition-all shadow-lg active:scale-95"
        >
          <Plus size={14} /> Add Variant
        </button>
      </div>

      {!variants.length ? (
        <p className="text-gray-500 text-sm mt-4 italic text-center pb-4">
          No variants available.
        </p>
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-700">
              <th className="p-3 text-left">Color</th>
              <th className="p-3 text-left">Size</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Price (Current)</th>
              <th className="p-3 text-left">Old Price</th>
              <th className="p-3 text-left">Discount</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((v, index) => (
              <tr
                key={`${productId}-${v.id || index}`}
                className="hover:bg-gray-700/50 transition group"
              >
                <td className="p-3 border-b border-gray-800 text-gray-200">
                  {v.color?.name || "Standard"}
                </td>
                <td className="p-3 border-b border-gray-800 text-gray-300">
                  {v.size?.name || "N/A"}
                </td>
                <td className="p-3 border-b border-gray-800">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      v.count > 0
                        ? "bg-green-900/30 text-green-400"
                        : "bg-red-900/30 text-red-400"
                    }`}
                  >
                    {v.count}
                  </span>
                </td>
                <td className="p-3 border-b border-gray-800 font-mono text-white font-semibold">
                  ${Number(v.price).toFixed(2)}
                </td>
                <td className="p-3 border-b border-gray-800 font-mono text-gray-500 line-through">
                  {v.oldPrice ? `$${Number(v.oldPrice).toFixed(2)}` : "—"}
                </td>
                <td className="p-3 border-b border-gray-800">
                  {v.discount ? (
                    <span className="text-red-400 font-bold bg-red-400/10 px-1.5 py-0.5 rounded">
                      -{v.discount}%
                    </span>
                  ) : (
                    <span className="text-gray-600">—</span>
                  )}
                </td>
                <td className="p-3 border-b border-gray-800 text-right">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => onVariantAction(v, "update", productId)}
                      className="text-amber-500 hover:text-amber-400 font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onVariantAction(v, "delete", productId)}
                      className="text-red-500 hover:text-red-400 font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export const VariantTable = memo(VariantTableComponent);
