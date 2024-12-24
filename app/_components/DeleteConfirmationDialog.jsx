'use client';

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";

export default function DeleteConfirmationDialog({ productId, trigger, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
        console.log('Deleting product:', productId); // Add logging
        const response = await axios.delete('/api/products', {
            data: { productId: parseInt(productId) }
        });
        
        if (response.data.success) {
            toast.success('Product deleted successfully');
            onDelete && onDelete();
        } else {
            console.log('Delete response:', response.data); // Add logging
            toast.error(response.data.message || 'Failed to delete product');
        }
    } catch (error) {
        console.log('Delete error details:', error.response?.data); // Add logging
        toast.error(error.response?.data?.message || 'Error deleting product');
    } finally {
        setIsDeleting(false);
    }
};


  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="bg-[#1a1a1a] border border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Delete Product</DialogTitle>
          <DialogDescription className="text-gray-400">
            This action cannot be undone. This will permanently delete your product.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            className="bg-transparent border border-gray-800 text-white hover:bg-gray-800"
            onClick={() => document.querySelector('button[type="button"]').click()}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
