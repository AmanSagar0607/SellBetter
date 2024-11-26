'use client';
import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { BadgeCheck, ShoppingCart, Sparkles } from 'lucide-react';

function ProductCardItem({ product }) {
    const discount = product.originalPrice 
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <div className="border border-gray-800 rounded-lg p-4 hover:border-pink-500/50 transition-all cursor-pointer group h-full flex flex-col">
            <div className="relative w-full h-[200px] bg-gray-900 rounded-lg overflow-hidden">
                <Image 
                    src={product.image} 
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform"
                    priority
                />
                {discount > 0 && (
                    <div className="absolute top-3 left-3 bg-pink-500 text-white px-2 py-1 rounded-md text-sm font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        {discount}% OFF
                    </div>
                )}
            </div>
            
            <div className="flex-grow flex flex-col py-4">
                <div className="min-h-[64px] mb-4">
                    <h2 className="text-xl font-medium text-white line-clamp-2">
                        {product.title}
                    </h2>
                </div>
                <div className="flex justify-between items-end mt-auto">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-bold text-pink-500">${product.price}</h2>
                            {product.originalPrice && (
                                <span className="text-gray-500 line-through text-sm">
                                    ${product.originalPrice}
                                </span>
                            )}
                        </div>
                        {discount > 0 && (
                            <p className="text-green-500 text-xs">Save ${product.originalPrice - product.price}</p>
                        )}
                    </div>
                    <Button 
                        size="sm"
                        className="group/btn bg-gray-900 border border-gray-800 hover:bg-gray-800 text-white transition-all duration-300 hover:scale-105 hover:border-pink-500/50"
                    >
                        <ShoppingCart className="w-4 h-4 mr-2 transition-transform group-hover/btn:scale-110 text-pink-500" />
                        Add to Cart
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-4 border-t border-gray-800 pt-4">
                <div className="relative w-[40px] h-[40px] flex-shrink-0">
                    <Image 
                        src={product?.user?.image} 
                        alt={product.user.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                        unoptimized
                    />
                </div>
                <div className="min-w-0">
                    <h2 className="text-white text-sm flex items-center gap-2 truncate">
                        {product.user.name}
                        {product.user.verified && (
                            <BadgeCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        )}
                    </h2>
                    <h2 className="text-gray-500 text-xs">Product Designer</h2>
                </div>
            </div>
        </div>
    );
}

export default ProductCardItem;