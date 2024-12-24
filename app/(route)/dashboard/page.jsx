import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChartIcon as ChartLine, BarChart, History, Package } from 'lucide-react';
import UserListing from "./_components/UserListing";
import PurchaseHistory from "./_components/PurchaseHistory";
import AnalyticsDashboard from "./_components/AnalyticsDashboard";

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
    <div className="px-6 md:px-32 lg:px-36 py-12 min-h-screen">
      <Tabs defaultValue="Listing" className="space-y-12">
        <div className="bg">
          <TabsList className="bg-transparent flex justify-start">
            <TabsTrigger value="Listing" className={tabStyles}>
              <Package className="w-4 h-4 mr-1 sm:mr-2" />
              My Products
            </TabsTrigger>
            <TabsTrigger value="Products" className={tabStyles}>
              <ChartLine className="w-4 h-4 mr-1 sm:mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="Purchase" className={tabStyles}>
              <History className="w-4 h-4 mr-1 sm:mr-2" />
              History
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="Listing">
          <div className="border border-gray-800 rounded-xl lg:p-8 p-4">
            <UserListing />
          </div>
        </TabsContent>

        <TabsContent value="Products">
          <div className="border border-gray-800 rounded-xl lg:p-8 p-4">
            <AnalyticsDashboard />
          </div>
        </TabsContent>

        <TabsContent value="Purchase">
          <div className="border border-gray-800 rounded-xl lg:p-8 p-4">
            <h1 className="lg:text-2xl text-lg font-semibold bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">
              Transaction History
            </h1>
            <div className="py-8">
              <PurchaseHistory />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Dashboard;