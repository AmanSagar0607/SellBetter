'use client';

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { Trash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const CartItemSkeleton = () => {
    return (
        <div className="flex items-center justify-between bg-white/5 p-2 rounded-lg border border-white/10">
            <div className="flex items-center">
                <Skeleton className="w-12 h-12 rounded-lg bg-white/10" />
                <div className="ml-4">
                    <Skeleton className="h-4 w-[150px] mb-2 bg-white/10" />
                    <Skeleton className="h-4 w-[70px] bg-white/10" />
                </div>
            </div>
            <Skeleton className="h-8 w-8 rounded-lg bg-white/10" />
        </div>
    );
};

const CartProductItem = ({ product, quantity = 1, onRemove }) => {
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(false);

    if (!product || !product.productId) {
        return <CartItemSkeleton />;
    }

    const price = parseFloat(product.price || 0).toFixed(2);
    const total = (price * quantity).toFixed(2);

    const handleRemove = async () => {
        if (!user?.id || isLoading) {
            toast.error("Unable to remove item", {
                /**
                 * This style object configures the appearance of a component.
                 * - color: Sets the text color to a specific red shade (#dc2626).
                 * - (Optional) backgroundColor: Can be used to set the background color.
                 * - (Optional) border: Can be used to define a border with a specific color and style.
                 */
                style: {
                    // backgroundColor: "#000000",
                    color: "#dc2626",
                    // border: "1px solid #dc2626"
                }
            });
            return;
        }

        setIsLoading(true);
        try {
            await onRemove();
            // Success toast is handled in CartList component
        } catch (error) {
            console.error('Remove item error:', error);
            toast.error("Failed to remove item", {
                style: {
                    // backgroundColor: "#000000",
                    color: "#dc2626",
                    // border: "1px solid #dc2626"
                }
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-between bg-white/5 p-2 rounded-lg border border-white/10">
            <div className="flex items-center">
                {product.imageUrl && (
                    <div className="relative w-12 h-12">
                        <Image
                            src={product.imageUrl}
                            alt={product.title || 'Product'}
                            className="object-cover rounded-lg"
                            fill
                            sizes="48px"
                            priority
                        />
                    </div>
                )}
                <div className="ml-4">
                    <h3 className="text-sm font-semibold text-white">{product.title}</h3>
                    <div className="flex flex-col gap-1">
                        <p className="text-sm text-white/70">
                            ${price} {quantity > 1 && `× ${quantity}`}
                        </p>
                        {quantity > 1 && (
                            <p className="text-sm font-medium text-white">
                                Total: ${total}
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <button
                className="p-2 text-red-500 hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleRemove}
                disabled={isLoading}
                aria-label="Remove item"
            >
                <Trash className="w-5 h-5" />
            </button>
        </div>
    );
};

export default CartProductItem;
