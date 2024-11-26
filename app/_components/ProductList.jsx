'use client';
import React, { useState, useEffect } from 'react';
import {Button} from '@/components/ui/button';
import Products from '../_mockData/Products';
import ProductCardItem from './ProductCardItem';
import { ArrowRight } from 'lucide-react';

function ProductList() {
    const [productList, setProductList] = useState([]);

    useEffect(() => {
        setProductList(Products);
    }, []);

    return (
        <div className="px-8 md:px-32 lg:px-36">
            <div className="relative">
                <div className="flex justify-between items-center mb-8">
                    <div className="space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">
                            Featured Digital Products
                        </h2>
                        <p className="text-gray-400 max-w-2xl">
                            Discover our newest collection of premium digital assets, carefully crafted by top creators
                        </p>
                    </div>
                    <Button 
                        variant="outline" 
                        className="group border-pink-500/20 bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 transition-all"
                    >
                        View All
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 relative">
                    {/* Glow Effect */}
                    <div className="absolute -inset-x-4 -inset-y-4 z-0 bg-gradient-to-r from-transparent via-pink-500/10 to-transparent blur-3xl opacity-50 pointer-events-none" />
                    
                    {productList.map((item, index) => (
                        <div key={index} className="relative z-10">
                            <ProductCardItem product={item} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProductList;