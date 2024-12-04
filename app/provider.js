'use client';

import { useEffect, useState } from "react";
import Header from "./_components/Header";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { CartContext } from "./_context/CartContext";
import { toast } from "sonner";

function Provider({ children }) {
    const [cart, setCart] = useState([]);
    const { user, isLoaded } = useUser();
    const [mounted, setMounted] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        setMounted(true);
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
                    imageUrl: user.imageUrl || user.profileImageUrl
                };

                console.log('Sending user data:', userData);
                const result = await axios.post('/api/user', { user: userData });
                console.log('API response:', result.data);
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
            <Header />
            {children}
        </CartContext.Provider>
    );
}

export default Provider;
