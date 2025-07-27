/*
* =================================================================================================
* FILE: src/app/dashboard/shopkeeper/page.tsx
*
* ACTION: Replace the code in this file.
* This is the new Shopkeeper Marketplace, featuring a two-column layout with a
* product list on the left and a detailed view on the right.
* =================================================================================================
*/
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { ProductCard, Product } from '@/components/custom/ProductCard'; // Updated import
import { Skeleton } from "@/components/ui/skeleton";

// A new component for the right-side detail view
function ProductDetailView({ product }: { product: Product }) {
  return (
    <div className="sticky top-24"> {/* Makes the right column "stick" while scrolling */}
      <div className="border rounded-lg overflow-hidden">
        <div className="relative w-full h-64">
          <Image
            src={product.imageUrl || 'https://placehold.co/600x400/e2e8f0/475569?text=Image'}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-6">
            <h2 className="text-2xl font-bold">{product.name}</h2>
            <p className="text-md text-muted-foreground mb-2">by {product.seller?.brandName || 'Unknown Seller'}</p>
            <p className="text-3xl font-bold text-primary my-4">₹{product.price.toFixed(2)}</p>
            
            <div className="text-sm space-y-2 my-4">
              <p><span className="font-semibold">Location:</span> {product.location}</p>
              <p><span className="font-semibold">Category:</span> {product.category}</p>
              <p><span className="font-semibold">Stock:</span> {product.stock > 0 ? `${product.stock} units available` : 'Out of Stock'}</p>
            </div>

            <p className="text-sm text-foreground leading-relaxed my-4">{product.description}</p>
            
            <Button size="lg" className="w-full mt-2">Add to Cart</Button>
        </div>
      </div>
    </div>
  );
}

export default function ShopkeeperMarketplace() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/products');
        const data = await response.json();
        if (data.success && data.products.length > 0) {
          setProducts(data.products);
          setSelectedProduct(data.products[0]); // Select the first product by default
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <main className="container mx-auto py-8">
      <div className="mb-8 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input placeholder="Search by product name, category..." className="pl-10 h-12 text-lg" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Product List */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-lg" />)
            ) : products.length > 0 ? (
              products.map((product) => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                  isSelected={selectedProduct?._id === product._id}
                  onSelect={() => setSelectedProduct(product)}
                />
              ))
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground p-8 border rounded-lg">
                <p>No products found.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Column: Product Detail */}
        <div className="lg:col-span-7 xl:col-span-8">
          {isLoading ? (
            <Skeleton className="h-[600px] w-full rounded-lg" />
          ) : selectedProduct ? (
            <ProductDetailView product={selectedProduct} />
          ) : (
             <div className="flex h-full items-center justify-center text-muted-foreground p-8 border rounded-lg">
               <p>Select a product to see details.</p>
             </div>
          )}
        </div>
      </div>
    </main>
  );
}
