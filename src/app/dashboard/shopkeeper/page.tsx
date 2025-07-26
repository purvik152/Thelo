/*
* =================================================================================================
* FILE: src/app/dashboard/shopkeeper/page.tsx
*
* This is the updated Shopkeeper Dashboard. It no longer uses mock data.
* - It fetches all 'Active' products from the live API.
* - The search and location filters now work on the real data.
* =================================================================================================
*/
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductCard } from '@/components/custom/ProductCard';
import { Search, MapPin } from 'lucide-react';

type Product = {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  location: string;
  seller?: {
    brandName?: string;
  };
};

export default function ShopkeeperMarketplace() {
  const [allProducts, setAllProducts] = useState<Product[]>([]); // To store the original list
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // To display
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch products.");
        setAllProducts(data.products);
        setFilteredProducts(data.products);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    let filtered = allProducts;

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (location) {
      filtered = filtered.filter(p => 
        p.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    setFilteredProducts(filtered);
  };

  return (
    <div className="container py-8">
      <div className="mb-10 rounded-lg bg-card p-6 border shadow-sm">
        <h1 className="text-2xl font-bold mb-4">Find Products for Your Shop</h1>
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input type="text" placeholder="Product name or category" className="pl-10 h-12" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="md:col-span-2 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input type="text" placeholder="City or State" className="pl-10 h-12" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <Button type="submit" className="h-12 text-base font-semibold md:col-span-1">Find Products</Button>
        </form>
      </div>

      {isLoading ? (
        <div className="text-center col-span-full py-16">
            <h2 className="text-2xl font-semibold">Loading products...</h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product: any) => (
            <ProductCard key={product._id} product={{
                id: product._id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                seller: {
                    brandName: product.seller?.brandName || 'N/A',
                    location: product.location
                }
            }} />
          ))}
        </div>
      )}

      {!isLoading && filteredProducts.length === 0 && (
        <div className="text-center col-span-full py-16">
            <h2 className="text-2xl font-semibold">No products found</h2>
            <p className="text-muted-foreground mt-2">Try adjusting your search terms or check back later.</p>
        </div>
      )}
    </div>
  );
}
