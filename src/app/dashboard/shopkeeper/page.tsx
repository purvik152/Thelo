/*
* =================================================================================================
* FILE: src/app/dashboard/shopkeeper/page.tsx
*
* This is the main marketplace page for the Shopkeeper.
* It includes the search functionality and a grid of products.
*
* NOTE: This page works together with the layout.tsx, Navbar.tsx, and ProductCard.tsx
* files I provided earlier.
* =================================================================================================
*/
"use client";

import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductCard, Product } from '@/components/custom/ProductCard';
import { Search, MapPin } from 'lucide-react';

// Mock data for products. In a real application, this would come from an API call.
const mockProducts: Product[] = [
  { id: '1', name: 'Handmade Leather Wallets', price: 850, imageUrl: 'https://placehold.co/400x400/5a3a2a/white?text=Wallet', seller: { brandName: 'Crafty Creations', location: 'Jaipur, Rajasthan' } },
  { id: '2', name: 'Organic Spices Combo', price: 1200, imageUrl: 'https://placehold.co/400x400/c27c0e/white?text=Spices', seller: { brandName: 'Kerala Flavors', location: 'Kochi, Kerala' } },
  { id: '3', name: 'Block-Printed Cotton Sarees', price: 2500, imageUrl: 'https://placehold.co/400x400/8e44ad/white?text=Saree', seller: { brandName: 'Sanganer Prints', location: 'Jaipur, Rajasthan' } },
  { id: '4', name: 'Artisanal Coffee Beans', price: 600, imageUrl: 'https://placehold.co/400x400/6d4c41/white?text=Coffee', seller: { brandName: 'Coorg Roastery', location: 'Madikeri, Karnataka' } },
  { id: '5', name: 'Terracotta Pottery Set', price: 1500, imageUrl: 'https://placehold.co/400x400/e67e22/white?text=Pottery', seller: { brandName: 'Village Crafts', location: 'Kolkata, West Bengal' } },
  { id: '6', name: 'Hand-poured Scented Candles', price: 450, imageUrl: 'https://placehold.co/400x400/f1c40f/white?text=Candle', seller: { brandName: 'The Glow Co.', location: 'Goa' } },
];

export default function ShopkeeperMarketplace() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');

  // Load mock products when the component mounts
  useEffect(() => {
    // In the future, this will be an API call:
    // const response = await fetch('/api/products');
    // const data = await response.json();
    setProducts(mockProducts);
  }, []);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(`Searching for "${searchTerm}" in "${location}"`);
    // Here you would filter the products or make a new API call
    const filtered = mockProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        p.seller.location.toLowerCase().includes(location.toLowerCase())
    );
    setProducts(filtered);
  };

  return (
    <div className="container py-8">
      {/* Search Section - Inspired by Indeed */}
      <div className="mb-10 rounded-lg bg-card p-6 border shadow-sm">
        <h1 className="text-2xl font-bold mb-4">Find Products for Your Shop</h1>
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Product name, category, or keyword" 
              className="pl-10 h-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="md:col-span-2 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="City, state, or 'remote'" 
              className="pl-10 h-12"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <Button type="submit" className="h-12 text-base font-semibold md:col-span-1">Find Products</Button>
        </form>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {products.length === 0 && (
        <div className="text-center col-span-full py-16">
            <h2 className="text-2xl font-semibold">No products found</h2>
            <p className="text-muted-foreground mt-2">Try adjusting your search terms.</p>
        </div>
      )}
    </div>
  );
}
