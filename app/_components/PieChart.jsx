"use client";

import React, { useMemo } from "react";
import { PieChart as RechartsDonutChart, Pie, Cell, Label, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from 'lucide-react';

const COLORS = ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];

export function PieChart({ data }) {
  const chartData = useMemo(() => {
    if (!data || !data.productCategories) return [];
    return data.productCategories.map((category, index) => {
      const currentSales = parseInt(category.totalSales);
      const previousSales = parseInt(category.previousTotalSales);
      const growthPercentage = ((currentSales - previousSales) / previousSales) * 100;

      return {
        name: category.name,
        value: currentSales,
        fill: COLORS[index % COLORS.length],
        growthPercentage,
      };
    });
  }, [data]);

  const totalSales = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0);
  }, [chartData]);

  if (chartData.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <Card className="flex flex-col bg-gray-800/50 border-gray-700">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-xl font-semibold text-white">Product Categories</CardTitle>
        <CardDescription className="text-gray-400">Sales Distribution</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="mx-auto aspect-square w-full h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsDonutChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
                <Label
                  content={({ viewBox }) => {
                    const { cx, cy } = viewBox;
                    return (
                      <text x={cx} y={cy} fill="white" textAnchor="middle" dominantBaseline="central">
                        <tspan x={cx} y={cy} dy="-0.5em" fontSize="24" fontWeight="bold">
                          {totalSales}
                        </tspan>
                        <tspan x={cx} y={cy} dy="1.5em" fontSize="12" fill="#888888">
                          Total Sales
                        </tspan>
                      </text>
                    );
                  }}
                />
              </Pie>
            </RechartsDonutChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {/* {chartData.map((category, index) => (
          <div key={index} className="flex items-center gap-2 font-medium leading-none text-white">
            {category.growthPercentage >= 0 ? (
              <>
                {category.name}: Trending up by {category.growthPercentage.toFixed(2)}% <TrendingUp className="h-4 w-4 text-green-500" />
              </>
            ) : (
              <>
                {category.name}: Trending down by {Math.abs(category.growthPercentage).toFixed(2)}% <TrendingDown className="h-4 w-4 text-red-500" />
              </>
            )}
          </div>
        ))} */}
        <div className="leading-none text-gray-400">
          Showing total sales by product category
        </div>
      </CardFooter>
    </Card>
  );
}