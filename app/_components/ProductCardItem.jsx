"use client";

import React, { useState, useContext } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  BadgeCheck,
  MoreVerticalIcon,
  ShoppingCart,
  Sparkles,
  Heart,
  Info,
  PlusCircleIcon,
} from "lucide-react";
import ProductEditableOption from "./ProductEditableOption";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { CartContext } from "../_context/CartContext";

function ProductCardItem({ product, editable = false }) {
  const { cart, setCart } = useContext(CartContext);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const { isSignedIn } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);

  const price = parseFloat(product.price) || 0;
  const originalPrice =
    parseFloat(product.originalPrice || product.original_price) || price;
  const discount =
    originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;
  const savings = originalPrice > price ? originalPrice - price : 0;
  const defaultUserImage = "/placeholder-user.png";
  const defaultProductImage = "/placeholder-product.png";

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);

    try {
      if (!isSignedIn) {
        window.location.href = "/sign-in";
        return;
      }

      const productWithId = {
        ...product,
        productId: product.id,
        cartId: Date.now(),
      };
      setCart((prevCart) => [...prevCart, productWithId]);

      const response = await axios.post("/api/cart", {
        userId: user?.id,
        productId: product?.id,
      });

      if (!response.data?.success) {
        setCart((prevCart) =>
          prevCart.filter((item) => item.cartId !== productWithId.cartId)
        );
        toast.error(response.data?.error || "Failed to add to cart");
      } else {
        setCart((prevCart) =>
          prevCart.map((item) =>
            item.cartId === productWithId.cartId
              ? { ...item, cartId: response.data.data.id }
              : item
          )
        );
        toast.success("Added to cart successfully");
      }
    } catch (error) {
      setCart((prevCart) =>
        prevCart.filter((item) => item.cartId !== productWithId.cartId)
      );
      toast.error(error.response?.data?.error || "Failed to add to cart");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = (e) => {
    if (e.target.closest("button") || e.target.closest(".no-navigate")) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className="border border-gray-800 rounded-xl p-4 hover:border-pink-500/30 transition-all group bg-black/50 backdrop-blur-sm">
      <div className="aspect-square rounded-lg overflow-hidden bg-gray-800">
        <div className="relative w-full h-full">
          <Link href={"/store/" + product?.id} onClick={handleCardClick}>
            <Image
              src={product.imageUrl || defaultProductImage}
              alt={product.title || "Product Image"}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority
            />
          </Link>
          {discount > 0 && (
            <div className="absolute top-3 left-3 bg-pink-500/10 text-pink-400 px-2.5 py-1 rounded-full text-sm font-medium backdrop-blur-sm flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {discount}% OFF
            </div>
          )}
          <Button
            size="sm"
            variant="outline"
            className={`absolute top-3 right-3 p-2 h-8 w-8 rounded-full border-pink-500/20 transition-all backdrop-blur-sm ${
              isFavorite
                ? "bg-pink-500/20 text-pink-400"
                : "bg-black/50 text-pink-400 hover:bg-pink-500/20"
            }`}
            onClick={(e) => {
              e.preventDefault();
              setIsFavorite(!isFavorite);
            }}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
          </Button>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <Link href={"/store/" + product?.id} onClick={handleCardClick}>
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-lg font-semibold text-white line-clamp-2 leading-tight">
              {product.title}
            </h2>
          </div>
        </Link>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-pink-400">
            ${price.toFixed(2)}
          </span>
          {discount > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-gray-500 line-through">
                ${originalPrice.toFixed(2)}
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 p-0 text-pink-400 hover:text-pink-500"
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-pink-500/10 border border-pink-500/20 text-pink-400">
                    <p className="font-medium text-xs">
                      Save ${savings.toFixed(2)}!
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center justify-between w-full">
            {product.user && (
              <div className="flex items-center gap-2 min-w-0">
                <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={product.user.image || defaultUserImage}
                    alt={product.user.name || "User"}
                    fill
                    sizes="24px"
                    className="object-cover"
                  />
                </div>
                <span className="text-sm text-gray-400 truncate">
                  {product.user.name || "Anonymous"}
                </span>
              </div>
            )}

            {editable && (
              <div className="no-navigate">
                <ProductEditableOption productId={product.id}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:bg-transparent hover:text-gray-400"
                  >
                    <MoreVerticalIcon className="w-4 h-4" />
                  </Button>
                </ProductEditableOption>
              </div>
            )}
          </div>

          {!editable && (
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={isLoading}
              className="bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 hover:text-pink-500 border border-pink-500/20 transition-all flex items-center justify-center gap-2 px-3 py-2 rounded-xl font-medium"
            >
              <PlusCircleIcon className="w-4 h-4" />
              <span className="font-medium">Add to Cart</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCardItem;
