"use client";
import React, { useContext } from "react";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { CartContext } from "@/app/_context/CartContext";
import { ShoppingBag } from "lucide-react";

export function Header() {
  const { user } = useUser();
  const { cart } = useContext(CartContext);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-lg border-b border-pink-500/20">
      <div className="px-8 md:px-32 lg:px-36 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-white">
            SellBetter
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/checkout" className="relative">
              <ShoppingBag className="h-6 w-6 text-gray-300 hover:text-white transition-colors" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>
            
            {user ? (
              <div className="flex items-center gap-4">
                <Link 
                  href="/dashboard" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <Link
                href="/sign-in"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 