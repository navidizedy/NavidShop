"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";

interface SizeRowProps {
  size: {
    id: number;
    name: string;
  };
  onEdit: () => void;
  onDelete: () => void;
}

const SizeRow = memo(function SizeRow({
  size,
  onEdit,
  onDelete,
}: SizeRowProps) {
  return (
    <tr className="hover:bg-gray-700/30 transition-colors group">
      <td className="p-4">
        <span className="text-gray-500 font-mono text-xs bg-gray-900/50 px-2 py-1 rounded border border-gray-700">
          #{size.id.toString().slice(-4)}
        </span>
      </td>

      <td className="p-4 font-semibold text-gray-100 uppercase tracking-wide">
        {size.name}
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

export default SizeRow;
