"use client";
import { memo } from "react";
import { Button } from "@/components/ui/button";

const ColorRow = memo(function ColorRow({ color, onEdit, onDelete }: any) {
  return (
    <tr className="hover:bg-gray-700/30 transition-colors group">
      <td className="p-4 whitespace-nowrap">
        <span className="text-gray-500 font-mono text-xs bg-gray-900/50 px-2 py-1 rounded border border-gray-700">
          #{color.id.toString().slice(-4)}
        </span>
      </td>

      <td className="p-4">
        <div
          className="w-10 h-10 rounded-full border border-gray-600 shadow-sm transition-transform group-hover:scale-110"
          style={{ backgroundColor: color.name }}
        />
      </td>

      <td className="p-4">
        <span className="font-medium text-gray-100 uppercase tracking-wide">
          {color.name}
        </span>
      </td>

      <td className="p-4 text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10 font-bold text-xs"
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-red-500 hover:text-red-400 hover:bg-red-500/10 font-bold text-xs"
          >
            Remove
          </Button>
        </div>
      </td>
    </tr>
  );
});

export default ColorRow;
