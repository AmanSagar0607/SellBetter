"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChartLine, PenBox, Trash } from "lucide-react";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

function ProductEditableOption({ children, productId }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="cursor-pointer">{children}</div>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-0 bg-[#1a1a1a] border border-gray-800 rounded-lg text-white shadow-lg">
        <ul className="text-sm">
          <li className="flex items-center gap-2 px-2 py-1.5 hover:bg-pink-500/10 text-gray-300 hover:text-pink-500 rounded-sm cursor-pointer transition-colors">
            <PenBox className="w-4 h-4" />
            <span>Edit</span>
          </li>
          <li className="flex items-center gap-2 px-2 py-1.5 hover:bg-pink-500/10 text-gray-300 hover:text-pink-500 rounded-sm cursor-pointer transition-colors">
            <ChartLine className="w-4 h-4" />
            <span>Analytics</span>
          </li>
          <li className="flex items-center gap-2 px-2 py-1.5 hover:bg-pink-500/10 text-gray-300 hover:text-red-600 rounded-sm cursor-pointer transition-colors">
            <Trash className="w-4 h-4" />
            <DeleteConfirmationDialog
              productId={productId}
              trigger={<span>Delete</span>}
              onDelete={() => {
                console.log("Product deleted, reloading..."); // Add logging
                window.location.reload();
              }}
            />
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
}

export default ProductEditableOption;
