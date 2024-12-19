"use client"
import React, { useContext,useState } from "react";
import { CartContext } from "@/app/_context/CartContext";
import {
  Trash,
  ShoppingBag,
  CreditCard,
  Receipt,
  Calculator,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

function Checkout() {
  const { cart, setCart } = useContext(CartContext);
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Group cart items by productId
  const groupedCart = cart.reduce((acc, item) => {
    const key = item.productId;
    if (!acc[key]) {
      acc[key] = {
        ...item,
        quantity: 1,
        totalPrice: parseFloat(item.price),
      };
    } else {
      acc[key].quantity += 1;
      acc[key].totalPrice += parseFloat(item.price);
    }
    return acc;
  }, {});

  const removeFromCart = async (productId) => {
    if (!productId || !user?.id) {
      toast.error("Unable to remove item. Please try again.");
      return;
    }

    try {
      const response = await axios.delete(
        `/api/cart?userId=${user.id}&productId=${productId}`
      );

      if (response.data?.success) {
        setCart((prevCart) =>
          prevCart.filter((item) => item.productId !== productId)
        );
        toast.success("Items removed from cart");
      }
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item. Please try again.");
    }
  };

  // Updated onPaymentSuccess function with better error handling
  const onPaymentSuccess = async () => {
    if (!user?.id) {
      toast.error("Please sign in to complete your order");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      setIsLoading(true);

      // Prepare order details with proper fields
      const orderDetails = Object.values(groupedCart).map(item => ({
        userId: user.id,
        productId: parseInt(item.productId), // Ensure productId is a number
        title: item.title,
        price: item.price,
        category: item.category || 'Uncategorized',
        imageUrl: item.imageUrl,
        productUrl: item.productUrl,
        quantity: item.quantity,
        totalPrice: item.totalPrice
      }));

      // Send order to API
      const response = await axios.post("/api/orders", {
        orderDetails,
        userId: user.id,
        cartItems: Object.values(groupedCart)
      });

      if (response.data?.success || response.data?.response) {
        setCart([]);
        toast.success("Order completed successfully!");
        router.push('/dashboard');
      } else {
        throw new Error("Failed to create order");
      }
    } catch (error) {
      console.error("Order creation error:", error);
      toast.error(error.response?.data?.error || "Failed to create order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-8 md:px-32 lg:px-36 py-12 bg-black min-h-screen">
      <div className="flex flex-col mb-12">
        <div className="space-y-2">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text tracking-tight">
            Checkout
          </h2>
          <p className="text-gray-400 text-lg">Complete your purchase</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-black/50 border border-pink-500/20 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-white mb-4">
              Order Summary
            </h3>
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <ShoppingBag className="w-16 h-16 text-pink-500/20" />
                <p className="text-gray-400 text-center">Your cart is empty</p>
                <Link href="/store">
                  <button className="bg-pink-500/10 text-pink-400 border border-pink-500/20 px-6 py-2 rounded-lg text-sm font-semibold hover:bg-pink-500/20 transition-colors backdrop-blur-sm">
                    Browse Products
                  </button>
                </Link>
              </div>
            ) : (
              <ScrollArea className={cart.length > 4 ? "h-[450px] pr-4" : ""}>
                <div className="space-y-4">
                  {Object.values(groupedCart).map((item) => (
                    <div
                      key={`${item.productId}-${item.id}`}
                      className="flex items-center justify-between py-3 border-b border-pink-500/20"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-4">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div>
                            <h4 className="text-white text-lg font-bold mb-1">
                              {item.title}
                            </h4>
                            <div className="flex flex-col space-y-1">
                              <div className="flex items-center gap-2">
                                <p className="text-white">
                                  ${item.price} × {item.quantity}
                                </p>
                                <span className="text-pink-400">=</span>
                                <p className="text-white font-medium">
                                  ${item.totalPrice.toFixed(2)}
                                </p>
                              </div>
                              <p className="text-gray-400 line-through text-xs">
                                $
                                {(
                                  parseFloat(item.originalPrice) * item.quantity
                                ).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-pink-500/10"
                        >
                          <Trash size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>

        {/* Payment Details */}
        <div className="space-y-6">
          <div className="bg-black/50 border border-pink-500/20 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-6">
              <CreditCard className="w-5 h-5 text-pink-400" />
              <h3 className="text-xl font-semibold text-white">
                Payment Details
              </h3>
            </div>
            <div className="space-y-6">
              <div className="bg-pink-500/5 rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-100">Subtotal</span>
                  </div>
                  <span className="text-gray-400 font-medium">
                    $
                    {cart.length > 0
                      ? Object.values(groupedCart)
                          .reduce((total, item) => total + item.totalPrice, 0)
                          .toFixed(2)
                      : "0.00"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-100">Tax</span>
                  </div>
                  <span className="text-gray-400 font-medium">$0.00</span>
                </div>
              </div>
              <div className="border-t border-pink-500/20 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">Total Amount</span>
                  <div className="text-right">
                    <span className="text-gray-200 font-semibold text-lg">
                      $
                      {cart.length > 0
                        ? Object.values(groupedCart)
                            .reduce((total, item) => total + item.totalPrice, 0)
                            .toFixed(2)
                        : "0.00"}
                    </span>
                  </div>
                </div>
              </div>
              <Button 
                onClick={onPaymentSuccess} 
                disabled={isLoading || cart.length === 0}
              >
                {isLoading ? "Processing..." : "Create order"}
              </Button>
              {/* <button 
>>>>>>> master
                                className="w-full bg-pink-500/10 text-pink-400 border border-pink-500/20 py-3 rounded-lg font-semibold hover:bg-pink-500/20 transition-colors backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => {
                                    // Payment processing logic will be implemented here
                                    toast.success("Processing your payment...");
                                }}
                                disabled={cart.length === 0}
                            >
                                Pay Now
                            </button> */}
              {/* Replace the Pay Now button with PayPalButtons */}
              <div className="mt-10 justify-center">
                {cart.length > 0 ? (
                  <PayPalButtons
                    style={{ layout: "horizontal" }}
                    createOrder={(data, actions) => {
                      const totalAmount = Object.values(groupedCart)
                        .reduce((total, item) => total + item.totalPrice, 0)
                        .toFixed(2);

                      // Validate amount before creating order
                      if (totalAmount <= 0) {
                        toast.error("Invalid order amount");
                        return;
                      }

                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              value: totalAmount,
                              currency_code: "USD",
                            },
                          },
                        ],
                      });
                    }}
                    onApprove={async (data, actions) => {
                      try {
                        // Capture the payment
                        await actions.order.capture();
                        // Show success toast
                        toast.success(
                          "Payment successful! Thank you for your order."
                        );
                        onPaymentSuccess(); // Call your existing success handler
                      } catch (err) {
                        console.error("PayPal capture error:", err);
                        toast.error("Error capturing payment");
                      }
                    }}
                    onCancel={() => toast.error("Payment cancelled")}
                    onError={(err) => {
                      console.error("PayPal error:", err);
                      toast.error("Error processing payment");
                    }}
                  />
                ) : (
                  <button
                    className="w-full bg-pink-500/10 text-pink-400 border border-pink-500/20 py-3 rounded-lg font-semibold opacity-50 cursor-not-allowed"
                    disabled
                  >
                    Add items to cart to checkout
                  </button>
                )}
              </div>
              <p className="text-gray-200 text-sm text-center">
                This service is only available for customers outside of India.
              </p>
              <p className="text-gray-400 text-sm text-center">
                Your payment receipt and product details will be delivered to
                your registered email address
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
