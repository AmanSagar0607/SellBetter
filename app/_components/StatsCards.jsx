import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Package, Trash2 } from 'lucide-react';

export function StatsCards({ data }) {
  // Ensure the data is valid and provide default values if necessary
  const totalEarnings = isNaN(Number(data.totalEarnings)) ? 0 : Number(data.totalEarnings);
  const totalOrders = data.totalOrders || 0;
  const activeProducts = data.activeProducts || 0;
  const deletedProducts = data.deletedProducts || 0;

  const stats = [
    {
      title: "Total Earnings",
      value: `$${totalEarnings.toFixed(2)}`,
      icon: DollarSign,
    },
    {
      title: "Total Orders",
      value: totalOrders,
      icon: ShoppingCart,
    },
    {
      title: "Active Products",
      value: activeProducts,
      icon: Package,
    },
    {
      title: "Deleted Products",
      value: deletedProducts,
      icon: Trash2,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-gray-800/50 border-gray-700">
          <CardContent className="flex flex-row items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-400">{stat.title}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
            <div className="p-2 bg-gray-700 rounded-full">
              <stat.icon className="w-6 h-6 text-pink-400" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}