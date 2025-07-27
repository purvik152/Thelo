/*
* =================================================================================================
* FILE: src/components/custom/MarketplaceSearch.tsx
*
* ACTION: Replace the code in this file.
* This version is now a controlled component that gets its state and functions from its parent.
* =================================================================================================
*/
"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin } from 'lucide-react';

// Define the component's props
interface MarketplaceSearchProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    location: string;
    setLocation: (value: string) => void;
    onSearch: () => void;
}

export function MarketplaceSearch({ 
    searchTerm, 
    setSearchTerm, 
    location, 
    setLocation, 
    onSearch 
}: MarketplaceSearchProps) {
    return (
        <div className="w-full">
        <div className="bg-card p-6 rounded-lg border max-w-7xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Find Products for Your Shop</h2>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Search Input */}
                <div className="relative md:col-span-5">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input 
                        type="text"
                        placeholder="Product name or category" 
                        className="pl-10 h-12 bg-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {/* Location Input */}
                <div className="relative md:col-span-5">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input 
                        type="text"
                        placeholder="City or State" 
                        className="pl-10 h-12 bg-white"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>
                {/* Search Button */}
                <div className="md:col-span-2">
                    <Button 
                        size="lg" 
                        className="w-full h-12 bg-[#BEA093] hover:bg-[#FBF3E5] hover:text-[#BEA093]"
                        onClick={onSearch}
                    >
                        Find Products
                    </Button>
                </div>
            </div>
        </div>
        </div>
    );
}