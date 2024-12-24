'use client';

import { useEffect, useState } from "react";
import Header from "./_components/Header";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { CartContext } from "./_context/CartContext";
import { toast } from "sonner";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { NetworkStatus } from './_components/NetworkStatus';

function Provider({ children }) {
    const [cart, setCart] = useState([]);
    const { user, isLoaded } = useUser();
    const [mounted, setMounted] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        setMounted(true);

        // Initial online/offline status
        setIsOnline(navigator.onLine);

        const handleOnline = () => {
            setIsOnline(true);
            toast.success('Connection restored', {
                description: 'You are back online',
            });
        };

        const handleOffline = () => {
            setIsOnline(false);
            toast.error('Connection lost', {
                description: 'Please check your internet connection',
            });
        };

        // Add event listeners
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            // Cleanup event listeners
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    useEffect(() => {
        const checkUser = async () => {
            if (!user?.id || !isLoaded || isChecked) return;

            try {
                const userData = {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    emailAddresses: user.emailAddresses,
                    imageUrl: user.imageUrl || user.profileImageUrl,
                };

                await axios.post('/api/user', { user: userData });
                setIsChecked(true);
            } catch (error) {
                console.error('Error checking user:', error);
            }
        };

        if (mounted) {
            checkUser();
        }
    }, [user, isLoaded, mounted, isChecked]);

    const getCartItems = async () => {
        try {
            if (!user?.id) return;

            const response = await axios.get(`/api/cart?userId=${user.id}`);
            if (response.data?.success) {
                setCart(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching cart items:', error);
            setCart([]);
        }
    };

    useEffect(() => {
        if (user?.id && mounted) {
            getCartItems();
        }
    }, [user?.id, mounted]);

    if (!mounted) return null;

    return (
        <CartContext.Provider value={{ cart, setCart }}>
            <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID }}>
                {/* Network status banner */}
                {!isOnline && <NetworkStatus />}
                <Header />
                {children}
            </PayPalScriptProvider>
        </CartContext.Provider>
    );
}

export default Provider;
