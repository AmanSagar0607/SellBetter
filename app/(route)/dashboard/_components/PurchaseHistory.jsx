"use client";

import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Package, Download } from "lucide-react";
import { ScrollableContainer } from "@/app/_components/ScrollableContainer";

function PurchaseHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isLoaded } = useUser();

  const fetchUserOrders = async () => {
    try {
      if (!user?.id) return;
      const response = await axios.get(`/api/orders?userId=${user.id}`);
      if (response.data?.success) {
        setOrders(response.data.orders);
      } else {
        setError("Failed to load orders data");
      }
    } catch (error) {
      setError(error?.response?.data?.error || "Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserOrders();
    }
  }, [isLoaded, user]);

  if (!isLoaded) return null;

  if (error) {
    return (
      <div className="text-center py-12 px-4">
        <Package className="w-16 h-16 text-pink-500/30 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-white mb-2">Unable to Load Orders</h3>
        <p className="text-gray-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="lg:space-y-4 sm:space-y-4 space-y-0">
      {/* Table Header - Only visible on large screens */}
      <div className="hidden lg:grid lg:grid-cols-6 items-center px-6 py-4 bg-gray-900/50 rounded-lg">
        <h3 className="text-base font-medium text-gray-400 pl-2">Product</h3>
        <h3 className="text-base font-medium text-gray-400">Title</h3>
        <h3 className="text-base font-medium text-gray-400">Category</h3>
        <h3 className="text-base font-medium text-gray-400">Price</h3>
        <h3 className="text-base font-medium text-gray-400">Total Price</h3>
        <h3 className="text-base font-medium text-gray-400 pl-6">Action</h3>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="animate-pulse bg-gray-900/50 rounded-xl p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-md flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-800 rounded w-3/4" />
                    <div className="h-4 bg-gray-800 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 px-4">
            <Package className="w-16 h-16 text-pink-500/30 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No Orders Found</h3>
            <p className="text-gray-400">Your purchase history will appear here</p>
          </div>
        ) : (
          <ScrollableContainer items={orders} className="custom-scrollbar">
            {orders.map((order) => (
              <div key={order.orderId} className="bg-gray-900/50 p-4 rounded-xl">
                {/* Mobile Layout - Show below 1100px */}
                <div className="lg:hidden">
                  <div className="flex flex-col gap-6">
                    <div className="flex gap-5">
                      {order.imageUrl && (
                        <img
                          src={order.imageUrl}
                          alt={order.title}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 pt-1">
                        <h3 className="text-base font-semibold text-white truncate mb-2">
                          {order.title}
                        </h3>
                        <p className="text-sm text-gray-400">{order.category}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="space-y-2.5">
                        <p className="text-gray-400 text-sm">Price: ${order.price}</p>
                        <p className="text-gray-400/60 text-sm">${order.price} × {order.quantity}</p>
                        <p className="text-base font-semibold text-white">Total: ${order.totalPrice}</p>
                      </div>
                    </div>
                    <div className="w-full">
                      {order.productUrl && (
                        <a
                          href={order.productUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2.5 bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 hover:text-pink-500 rounded-md border border-pink-500/20 backdrop-blur-sm text-sm w-full justify-center"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Desktop Layout - Show above 1100px */}
                <div className="hidden lg:grid lg:grid-cols-6 lg:gap-4 lg:items-center px-2">
                  <div className="pl-2">
                    <img src={order.imageUrl} alt={order.title} className="w-16 h-16 object-cover rounded-lg" />
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="text-base font-semibold text-white truncate">{order.title}</h3>
                  </div>
                  <p className="text-sm text-gray-400">{order.category}</p>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-400/60">${order.price} × {order.quantity}</p>
                  </div>
                  <p className="text-base font-semibold text-white">${order.totalPrice}</p>
                  <div className="flex justify-center">
                    {order.productUrl && (
                      <a
                        href={order.productUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2.5 bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 hover:text-pink-500 rounded-md border border-pink-500/20 backdrop-blur-sm text-sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </ScrollableContainer>
        )}
      </div>
    </div>
  );
}

export default PurchaseHistory;
