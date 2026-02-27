"use client";
import { memo } from "react";

const CategoryRow = memo(function CategoryRow({
  category,
  onEdit,
  onDelete,
}: any) {
  return (
    <tr className="hover:bg-gray-700/30 transition-colors">
      <td className="p-4 whitespace-nowrap">
        <span className="text-gray-500 font-mono text-xs bg-gray-900/50 px-2 py-1 rounded border border-gray-700">
          #{category.id.toString().slice(-4)}
        </span>
      </td>

      <td className="p-4">
        <div className="w-12 h-12 rounded-lg bg-gray-700 overflow-hidden border border-gray-600">
          {category.imageUrl ? (
            <img
              src={category.imageUrl}
              alt={category.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-500">
              N/A
            </div>
          )}
        </div>
      </td>

      <td className="p-4 font-medium text-gray-200">{category.name}</td>

      <td className="p-4 text-right space-x-2 whitespace-nowrap">
        <button
          onClick={onEdit}
          className="text-xs font-bold text-yellow-500 hover:underline"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="text-xs font-bold text-red-500 hover:underline"
        >
          Delete
        </button>
      </td>
    </tr>
  );
});

export default CategoryRow;
