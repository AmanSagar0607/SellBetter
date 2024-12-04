'use client';

import { createContext } from 'react';

export const CartContext = createContext({
    cart: [],
    setCart: () => null
});