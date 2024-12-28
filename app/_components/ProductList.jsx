'use client';
import React, { useState, useEffect } from 'react';
import {Button} from '@/components/ui/button';
import Products from '../_mockData/Products';
import ProductCardItem from './ProductCardItem';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';


function ProductList() {
    const { user } = useUser();
    const [productList, setProductList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        GetProductList();
    }, []);

    const GetProductList = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/products?limit=10');
            console.log('Products response:', response.data);
            const products = response.data?.products || [];
            setProductList(products);
        } catch (error) {
            console.error('Error fetching products:', error);
            setProductList([]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="px-8 md:px-32 lg:px-36">
            <div className="relative">
                <div className="flex justify-between items-center mb-8">
                    <div className="space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">
                            Featured Digital Products
                        </h2>
                        <p className="text-gray-400 max-w-2xl">
                            Discover our newest collection of premium digital assets
                        </p>
                    </div>
                    <Link href="/store">
                    <Button 
                        variant="outline" 
                        className="group border-pink-500/20 bg-pink-500/10 text-pink-400 hover:bg-pink-500/20  hover:text-pink-500 transition-all"
                    >
                        View All
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative max-w-[1400px] mx-auto">
                    {/* Glow Effect */}
                    <div className="absolute -inset-x-4 -inset-y-4 z-0 bg-gradient-to-r from-transparent via-pink-500/10 to-transparent blur-3xl opacity-50 pointer-events-none" />
                    
                    {loading ? (
                        <>
                            {[1,2,3,4,5,6].map((item, index) => (
                                <div key={index} className="relative z-10 bg-gray-800/40 rounded-xl p-4 overflow-hidden">
                                    <div className="animate-pulse space-y-4">
                                        {/* Image placeholder */}
                                        <div className="h-40 bg-gray-700 rounded-lg overflow-hidden">
                                            <div className="w-full h-full bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-shimmer" />
                                        </div>
                                        {/* Title placeholder */}
                                        <div className="h-4 bg-gray-700 rounded w-3/4" />
                                        {/* Price and rating placeholder */}
                                        <div className="flex justify-between items-center">
                                            <div className="h-4 bg-gray-700 rounded w-1/4" />
                                            <div className="h-4 bg-gray-700 rounded w-1/4" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : productList.length === 0 ? (
                        <div className="col-span-full text-center py-10">
                            <p className="text-gray-400">No products available</p>
                        </div>
                    ) : (
                        productList.map((product, index) => (
                            <div key={index} className="relative z-10">
                                <ProductCardItem product={product} user={user}  />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductList;