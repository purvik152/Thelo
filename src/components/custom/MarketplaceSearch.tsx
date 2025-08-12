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
            <div className="bg-gradient-to-br from-white to-[#FDFBF4] p-8 rounded-2xl border border-gray-200 shadow-lg max-w-7xl backdrop-blur-sm">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-[#BEA093] to-[#D4C4B0] bg-clip-text text-transparent">
                        Find Products for Your Shop
                    </h2>
                    <p className="text-gray-600 mt-2">Search through thousands of quality products from trusted sellers</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    {/* Search Input */}
                    <div className="md:col-span-5 space-y-2">
                        <label className="text-sm font-medium text-gray-700">Product Search</label>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#BEA093] transition-colors duration-300" />
                            <Input
                                type="text"
                                placeholder="Search products, categories..."
                                className="pl-12 h-14 bg-white border-gray-300 focus:border-[#BEA093] focus:ring-[#BEA093]/20 transition-all duration-300 rounded-xl shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Location Input */}
                    <div className="md:col-span-5 space-y-2">
                        <label className="text-sm font-medium text-gray-700">Location</label>
                        <div className="relative group">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#BEA093] transition-colors duration-300" />
                            <Input
                                type="text"
                                placeholder="City, State, or Region"
                                className="pl-12 h-14 bg-white border-gray-300 focus:border-[#BEA093] focus:ring-[#BEA093]/20 transition-all duration-300 rounded-xl shadow-sm"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Search Button */}
                    <div className="md:col-span-2">
                        <Button
                            size="lg"
                            className="w-full h-14 bg-gradient-to-r from-[#BEA093] to-[#D4C4B0] hover:from-[#D4C4B0] hover:to-[#BEA093] text-white font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 rounded-xl"
                            onClick={onSearch}
                        >
                            <Search className="mr-2 h-5 w-5" />
                            Search
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
