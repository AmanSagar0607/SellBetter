'use client';
import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { BadgeCheck, MoreVerticalIcon, ShoppingCart, Sparkles } from 'lucide-react';
import ProductEditableOption from './ProductEditableOption';

function ProductCardItem({ product, editable=false }) {
    const discount = product.original_price
        ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
        : 0;

    // Default placeholder images
    const defaultUserImage = '/placeholder-user.png';
    const defaultProductImage = '/placeholder-product.png';

    return (
        <div className="border border-gray-800 rounded-lg p-4 hover:border-pink-500/50 transition-all group h-full flex flex-col bg-black">
            <div className="relative w-full h-[200px] bg-gray-900 rounded-lg overflow-hidden">
                <Image
                    src={product.imageUrl || defaultProductImage}
                    alt={product.title || 'Product Image'}
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
                <div className="min-h-[64px] mb-2">
                    <h2 className="text-xl font-medium text-white line-clamp-2">
                        {product.title}
                    </h2>
                </div>
                {product.user && (
                    <div className="flex items-center gap-2 mb-4">
                        <div className="relative w-6 h-6 rounded-full overflow-hidden">
                            <Image
                                src={product.user.image || defaultUserImage}
                                alt={product.user.name || 'User'}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <span className="text-sm text-gray-400">
                            {product.user.name || 'Anonymous'}
                            {product.user.verified && (
                                <BadgeCheck className="w-4 h-4 text-blue-500 inline ml-1" />
                            )}
                        </span>
                    </div>
                
                )}
                <div className="flex justify-between items-end mt-auto">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-bold text-pink-500">${product.price}</h2>
                            {product.original_price && (
                                <span className="text-gray-500 line-through text-sm">
                                    ${product.original_price}
                                </span>
                            )}
                        </div>
                        {discount > 0 && (
                            <p className="text-green-500 text-xs">Save ${product.original_price - product.price}</p>
                        )}
                    </div>
                    {!editable ? (
                        <Button
                            size="sm"
                            className="bg-pink-500 hover:bg-pink-600"
                        >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Buy Now
                        </Button>
                    ) : (
                        <div className="cursor-pointer">
                            <ProductEditableOption>
                                <MoreVerticalIcon className="w-4 h-4 text-pink-500 hover:text-pink-400 transition-colors" />
                            </ProductEditableOption>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductCardItem;