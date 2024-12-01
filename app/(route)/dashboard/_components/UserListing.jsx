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
    const [loading, setLoading] = useState(false);
    const { user } = useUser();

    useEffect(() => {
        if (user) {
            GetUserProductList();
        }
    }, [user]);

    const GetUserProductList = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/products');
            console.log('API Response:', response.data);
            if (response.data) {
                setListings(response.data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    }

    console.log('Current listings:', listings);

    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                    <h2 className='text-2xl font-semibold text-white'>Your Listings</h2>
                    <p className='text-sm text-gray-500'>Manage and track your product listings</p>
                </div>
                <Link href="/add-product">
                    <Button className='bg-[#EE519F] hover:bg-[#EE519F]/90'>
                        <Plus className='h-4 w-4 mr-2' />
                        Add New
                    </Button>
                </Link>
            </div>

            {loading ? (
                <div className="text-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/20 mx-auto"></div>
                    <p className="text-white/50 mt-4">Loading your products...</p>
                </div>
            ) : listings.length === 0 ? (
                <div className="text-center py-10">
                    <Package className="w-12 h-12 mx-auto mb-4 text-white/20" />
                    <p className="text-white/50">No products listed yet</p>
                    <p className="text-sm text-white/30 mt-1">Start selling by adding your first product</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 w-full">
                    {listings.map((product) => {
                        console.log('Rendering product:', product);
                        return <ProductCardItem key={product.id} product={product} />;
                    })}
                </div>
            )}
        </div>
    );
}

export default UserListing;