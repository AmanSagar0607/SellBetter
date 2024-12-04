"use client";

import ProductCardItem from '@/app/_components/ProductCardItem';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { Plus, Package } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

function UserListing() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, isLoaded } = useUser();

    useEffect(() => {
        if (isLoaded && user) {
            GetUserProductList();
        }
    }, [isLoaded, user]);
    
    const GetUserProductList = async () => {
        try {
            setLoading(true);
            if (!user?.id) return;
            
            const response = await axios.get(`/api/products?userId=${user.id}&type=user`);
            console.log('API Response:', response.data);
            if (response.data?.success) {
                setListings(response.data.products || []);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    // Don't render anything until Clerk is loaded
    if (!isLoaded) {
        return null;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold text-white">My Products</h1>
                    <p className="text-sm text-gray-400">Manage and track your product listings</p>
                </div>
                <Link href="/add-product" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 hover:text-pink-500 border border-pink-500/20 backdrop-blur-sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Product
                    </Button>
                </Link>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="relative bg-gray-900/50 rounded-xl p-4 overflow-hidden">
                            <div className="animate-pulse space-y-4">
                                <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
                                    <div className="w-full h-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800" />
                                </div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-800 rounded w-3/4" />
                                    <div className="h-4 bg-gray-800 rounded w-1/2" />
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <div className="h-6 bg-gray-800 rounded w-1/4" />
                                    <div className="flex space-x-2">
                                        <div className="h-8 w-8 bg-gray-800 rounded" />
                                        <div className="h-8 w-8 bg-gray-800 rounded" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : listings.length === 0 ? (
                <div className="text-center py-12 px-4">
                    <Package className="w-16 h-16 text-pink-500/30 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-white mb-2">No Products Found</h3>
                    <p className="text-gray-400 mb-6">Start selling by adding your first product</p>
                    <Link href="/add-product">
                        <Button className="bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 hover:text-pink-500 border border-pink-500/20 backdrop-blur-sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Your First Product
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                    {listings.map((product) => (
                        <ProductCardItem 
                            key={product.id} 
                            product={product}
                            editable={true}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default UserListing;