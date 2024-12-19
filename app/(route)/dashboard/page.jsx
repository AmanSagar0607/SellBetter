import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UserListing from './_components/UserListing';
import { Package, ShoppingCart, Store, Settings, Heart } from 'lucide-react';

function Dashboard() {
    const tabStyles = `
        relative px-4 sm:px-4 py-4
        data-[state=active]:text-pink-400
        data-[state=active]:bg-pink-500/10
        data-[state=active]:border-b-2 data-[state=active]:border-pink-500/20
        text-gray-400
        transition-all duration-300
        hover:text-white
        group
        overflow-hidden
        flex items-center
        text-left
        text-xs sm:sm md:text-base
        p-2.5 sm:p-2 md:p-2.5
        rounded-lg
    `;

    return (
        <div className='px-8 md:px-32 lg:px-36 py-12 min-h-screen'>
            <div className="flex flex-col mb-12">
                <div className="space-y-2">
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text tracking-tight">
                        Dashboard
                    </h2>
                    <p className="text-gray-400 text-lg">Manage your products and track your sales</p>
                </div>
            </div>

            <Tabs defaultValue="Listing" className="space-y-12">
                <div className="bg">
                    <TabsList className="bg-transparent flex justify-start">
                        <TabsTrigger value="Listing" className={tabStyles}>
                            <Package className="w-4 h-4 mr-1 sm:mr-2" />
                            My Products
                        </TabsTrigger>
                        <TabsTrigger value="Products" className={tabStyles}>
                            <Heart className="w-4 h-4 mr-1 sm:mr-2" />
                            Favourite
                        </TabsTrigger>
                        <TabsTrigger value="Purchase" className={tabStyles}>
                            <ShoppingCart className="w-4 h-4 mr-1 sm:mr-2" />
                            History
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="Listing">
                    <div className="border border-gray-800 rounded-xl p-8">
                        <UserListing />
                    </div>
                </TabsContent>

                <TabsContent value="Products">
                    <div className="border border-gray-800 rounded-xl p-8">
                        <div className="text-center py-16">
                            <Heart className="w-16 h-16 mx-auto mb-4 text-pink-500/50" />
                            <p className="text-white/90 text-xl font-medium mb-2">Your Favourites</p>
                            <p className="text-gray-400 text-base sm:text-lg max-w-md mx-auto">
                                Products you've marked as favorites will appear here
                            </p>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="Purchase">
                    <div className="border border-gray-800 rounded-xl p-8">
                        <div className="text-center py-16">
                            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-pink-500/50" />
                            <p className="text-white/90 text-xl font-medium mb-2">No Purchase History</p>
                            <p className="text-gray-400 text-base sm:text-lg max-w-md mx-auto">
                                Your purchase history and transaction details will appear here
                            </p>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default Dashboard;