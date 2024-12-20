"use client";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useContext, useState, useEffect, useMemo } from "react";
import { CartContext } from "../_context/CartContext";
import CartProductItem from "./CartProductItem";
import { X, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

// Cart skeleton component
const CartSkeleton = () => (
  <div className="space-y-4 pr-4">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="flex items-center justify-between bg-white/5 p-2 rounded-lg border border-white/10"
      >
        <div className="flex items-center">
          <Skeleton className="w-12 h-12 rounded-lg bg-white/10" />
          <div className="ml-4">
            <Skeleton className="h-4 w-[150px] mb-2 bg-white/10" />
            <Skeleton className="h-4 w-[70px] bg-white/10" />
          </div>
        </div>
        <Skeleton className="h-8 w-8 rounded-lg bg-white/10" />
      </div>
    ))}
  </div>
);

function CartList({ children }) {
  const { cart, setCart } = useContext(CartContext);
  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  // Optimized grouping function to handle same products with error handling
  const groupCartItems = useMemo(() => {
    if (!Array.isArray(cart)) return [];

    try {
      return cart.reduce((acc, item) => {
        if (!item?.productId) return acc;

        const key = item.productId;
        if (!acc[key]) {
          acc[key] = {
            ...item,
            quantity: 1,
            price: parseFloat(item.price) || 0, // Ensure price is always a number
          };
        } else {
          acc[key].quantity += 1;
        }
        return acc;
      }, {});
    } catch (error) {
      console.error("Error grouping cart items:", error);
      return {};
    }
  }, [cart]);

  const groupedCart = useMemo(
    () => Object.values(groupCartItems),
    [groupCartItems]
  );

  // Memoized cart calculations
  const cartCalculations = useMemo(() => {
    const subtotal = groupedCart.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return total + price * quantity;
    }, 0);

    return {
      subtotal: subtotal.toFixed(2),
      itemCount: cart.length,
      uniqueItemCount: groupedCart.length,
    };
  }, [groupedCart, cart.length]);

  // Function to remove all instances of a product
  const removeAllInstances = async (productId) => {
    if (!productId || !user?.id) {
      toast.error("Unable to remove item. Please try again.");
      return;
    }

    try {
      const response = await axios.delete(
        `/api/cart?userId=${user.id}&productId=${productId}`
      );

      if (response.data?.success) {
        setCart((prevCart) =>
          prevCart.filter((item) => item.productId !== productId)
        );
        toast.success("Items removed from cart", {
          style: {
            // backgroundColor: "#000000",
            color: "#dc2626",
            // border: "1px solid #dc2626"
          },
        });
      } else {
        throw new Error(response.data?.error || "Failed to remove items");
      }
    } catch (error) {
      console.error("Failed to remove items:", error);
      toast.error("Failed to remove items. Please try again.");
    }
  };

  // Set loading to false after initial render
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded || isLoading) {
    return (
      <Sheet>
        <SheetTrigger>{children}</SheetTrigger>
        <SheetContent
          className="bg-black border-white/10 w-full sm:w-[440px] flex flex-col h-full"
          side="right"
        >
          <SheetHeader className="mb-6 relative flex-shrink-0">
            <SheetTitle className="text-white">Cart</SheetTitle>
            <SheetDescription className="text-white/70">
              Loading cart items...
            </SheetDescription>
          </SheetHeader>
          <CartSkeleton />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent
        className="bg-black border-white/10 w-full sm:w-[440px] flex flex-col h-full"
        side="right"
      >
        <SheetHeader className="mb-6 relative flex-shrink-0">
          <SheetClose className="absolute right-0 top-0 opacity-70 disabled:pointer-events-none data-[state=open]:bg-secondary">
            <X className="h-4 w-4 text-white" />
            <span className="sr-only">Close</span>
          </SheetClose>
          <SheetTitle className="text-white">Cart</SheetTitle>
          <SheetDescription className="text-white/70">
            Your cart has {cartCalculations.uniqueItemCount}{" "}
            {cartCalculations.uniqueItemCount === 1 ? "item " : "items "}(
            {cartCalculations.itemCount} total)
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 min-h-0">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <ShoppingBag className="w-16 h-16 text-white/20 mb-4" />
              <h3 className="text-white/70 text-lg font-medium">
                Your cart is empty
              </h3>
              <p className="text-white/50 text-sm">Add items to get started</p>
            </div>
          ) : (
            <ScrollArea
              className="h-[65vh] pr-4 custom-scrollbar"
              scrollHideDelay={0}
              style={{
                "--scrollbar-size": "4px",
                "--scrollbar-thumb-color": "rgba(255, 255, 255, 0.1)",
                "--scrollbar-thumb-hover-color": "rgba(255, 255, 255, 0.2)",
              }}
            >
              <div className="space-y-4">
                {groupedCart.map((product) => (
                  <CartProductItem
                    key={product.productId}
                    product={product}
                    quantity={product.quantity}
                    onRemove={() => removeAllInstances(product.productId)}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {cart.length > 0 && (
          <div className=" border-white/10 pt-4 sm:pt-6 mt-4 sm:mt-6 flex-shrink-0 bg-black px-4 sm:px-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <span className="text-white/70 text-sm sm:text-base">
                Total Amount
              </span>
              <span className="text-white font-semibold text-base sm:text-lg">
                ${cartCalculations.subtotal}
              </span>
            </div>
            <Link href="/checkout">
              <SheetClose asChild>
                <button className="w-full bg-pink-500 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors text-sm sm:text-base">
                  Proceed to Checkout
                </button>
              </SheetClose>
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default CartList;
