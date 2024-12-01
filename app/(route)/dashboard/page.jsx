import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UserListing from './_components/UserListing';
import { Package, ShoppingCart, Store, Settings } from 'lucide-react';

function Dashboard() {
    const tabStyles = `
        relative px-6 
        data-[state=active]:bg-black data-[state=active]:text-white 
        data-[state=active]:border-b-1 data-[state=active]:border-pink-300 
        text-white/70
        transition-all duration-300
        hover:text-white
        group
        overflow-hidden
        flex
        text-left
    `;

    const rippleStyles = `
        absolute inset-0 
        bg-gradient-to-r from-pink-500/10 via-pink-500/5 to-transparent
        translate-x-[100%] group-hover:translate-x-[-100%]
        transition-transform duration-300
    `;

    return (
        <div className='px-8 md:px-32 lg:px-36 py-12 min-h-screen'>
            <div className="flex items-center justify-between mb-12">
                <div className="space-y-2">
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text tracking-tight">
                        Dashboard
                    </h2>
                    <p className="text-gray-400 text-lg">Manage your products and track your sales</p>
                </div>
                <div className="flex items-center gap-4">
                    <Settings className="w-6 h-6 text-white/50 hover:text-white transition-colors cursor-pointer" />
                </div>
            </div>

            <Tabs defaultValue="Listing" className="space-y-8">
                <TabsList className="border bg-black border-white/10 flex justify-start w-full">
                    <TabsTrigger value="Listing" className={tabStyles}>
                        <Package className="w-4 h-4 mr-3 transition-transform group-hover:scale-110" />
                        Your Listings
                        <div className={rippleStyles} />
                    </TabsTrigger>
                    <TabsTrigger value="Products" className={tabStyles}>
                        <Store className="w-4 h-4 mr-3 transition-transform group-hover:scale-110" />
                        Products
                        <div className={rippleStyles} />
                    </TabsTrigger>
                    <TabsTrigger value="Purchase" className={tabStyles}>
                        <ShoppingCart className="w-4 h-4 mr-3 transition-transform group-hover:scale-110" />
                        Purchase History
                        <div className={rippleStyles} />
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="Listing">
                    <div className="border border-white/10 rounded-xl p-8">
                        <UserListing />
                    </div>
                </TabsContent>

                <TabsContent value="Products">
                    <div className="border border-white/10 rounded-xl p-8">
                        <div className="text-center py-16">
                            <Store className="w-16 h-16 mx-auto mb-6 text-white/20" />
                            <p className="text-white/70 text-xl font-medium mb-2">Your Product Collection</p>
                            <p className="text-white/40 text-lg">View and manage all your available products</p>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="Purchase">
                    <div className="border border-white/10 rounded-xl p-8">
                        <div className="text-center py-16">
                            <ShoppingCart className="w-16 h-16 mx-auto mb-6 text-white/20" />
                            <p className="text-white/70 text-xl font-medium mb-2">No Purchase History</p>
                            <p className="text-white/40 text-lg">Your purchase history will appear here</p>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default Dashboard;