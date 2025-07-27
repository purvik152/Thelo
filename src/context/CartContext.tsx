"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Toaster, toast } from 'sonner';

interface Product {
    _id: string;
    name: string;
    price: number;
    imageUrl?: string;
}

interface CartItem {
    product: Product;
    quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: Product, quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const addToCart = (product: Product, quantity: number) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.product._id === product._id);
            toast.success(`Added ${quantity} x ${product.name} to cart!`);

            if (existingItem) {
                return prevItems.map(item =>
                    item.product._id === product._id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                return [...prevItems, { product, quantity }];
            }
        });
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}