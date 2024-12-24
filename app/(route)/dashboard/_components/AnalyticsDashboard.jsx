"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChartIcon as ChartLine, BarChart } from 'lucide-react';
import { ShimmerLoading } from "@/app/_components/ShimmerLoading";
import { OverviewChart } from "@/app/_components/Overview-Chart";
import { PieChart } from "@/app/_components/PieChart";
import { StatsCards } from "@/app/_components/StatsCards";
import { ProductsTable } from "@/app/_components/ProductsTable";

export default function AnalyticsDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/analytics");
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return (
      <div className="space-y-12">
        <ShimmerLoading />
        <ShimmerLoading />
        <ShimmerLoading />
      </div>
    );
  }

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
    <div className="space-y-12">
      <Tabs defaultValue="overview" className="space-y-6">
        {/* <div className="bg">
          <TabsList className="bg-transparent flex justify-start">
            <TabsTrigger value="overview" className={tabStyles}>
              <ChartLine className="w-4 h-4 mr-1 sm:mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="products" className={tabStyles}>
              <BarChart className="w-4 h-4 mr-1 sm:mr-2" />
              Products
            </TabsTrigger>
          </TabsList>
        </div> */}

        <TabsContent value="overview">
          <div className="gap-4 space-y-4">
            <h1 className="lg:text-2xl text-lg font-semibold bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">
              Analytics Overview
            </h1>
            <StatsCards data={data} />
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4 text-white">Earnings Overview</h2>
              <OverviewChart data={data} />
            </div>
            <div className="mt-8">
              <PieChart data={data} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="products">
          <div className="border border-gray-800 rounded-xl lg:p-8 p-4">
            <h1 className="lg:text-2xl text-lg font-semibold bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text mb-8">
              Product Analytics
            </h1>
            <ProductsTable data={data} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}