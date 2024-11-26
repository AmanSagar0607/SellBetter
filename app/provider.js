"use client";

import { useEffect, useState } from "react";
import Header from "./_components/Header";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

function Provider({ children }) {
    const { user, isLoaded } = useUser();
    const [mounted, setMounted] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    // Handle hydration
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && isLoaded && user && !isChecked) {
            CheckIsNewUser();
            setIsChecked(true);
        }
    }, [mounted, isLoaded, user, isChecked]);

    const CheckIsNewUser = async () => {
        try {
            const userData = {
                firstName: user.firstName,
                lastName: user.lastName,
                emailAddresses: user.emailAddresses,
                imageUrl: user.imageUrl || user.profileImageUrl
            };

            console.log('Sending user data:', userData);
            const result = await axios.post('/api/user', { user: userData });
            console.log('API response:', result.data);
        } catch (error) {
            console.error('Error checking user:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
        }
    }

    // Don't render anything until mounted to prevent hydration issues
    if (!mounted) {
        return null;
    }

    return (
        <>
            <Header />
            {children}
        </>
    );
}

export default Provider;