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
            if (response.data) {
                setListings(response.data);
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
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-white">My Products</h1>
                <Link href="/add-product">
                    <Button className="bg-pink-500 text-white hover:bg-pink-600">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Product
                    </Button>
                </Link>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                        <div key={item} className="relative bg-gray-800/40 rounded-xl p-4 overflow-hidden">
                            <div className="animate-pulse space-y-4">
                                <div className="h-40 bg-gray-700 rounded-lg overflow-hidden">
                                    <div className="w-full h-full bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700" />
                                </div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-700 rounded w-3/4" />
                                    <div className="h-4 bg-gray-700 rounded w-1/2" />
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <div className="h-6 bg-gray-700 rounded w-1/4" />
                                    <div className="flex space-x-2">
                                        <div className="h-8 w-8 bg-gray-700 rounded" />
                                        <div className="h-8 w-8 bg-gray-700 rounded" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : listings.length === 0 ? (
                <div className="text-center py-10">
                    <Package className="w-10 h-10 text-white/30 mx-auto mb-2" />
                    <h3 className="text-xl font-medium">No Products Found</h3>
                    <p className="text-sm text-white/30 mt-1">Start selling by adding your first product</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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