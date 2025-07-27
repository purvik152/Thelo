/*
* =================================================================================================
* FILE: src/components/custom/SellerNavbar.tsx
*
* This is the main navigation bar for the Seller.
* It provides links to manage products and orders.
* =================================================================================================
*/
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { User, LogOut, Package, ShoppingBag } from 'lucide-react';

export function SellerNavbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout');
    router.push('/');
  };

  return (
    <header className="sticky top-2 z-50 w-full border rounded-lg max-w-7xl bg-[#FBF3E5] backdrop-blur supports-[backdrop-filter]:bg-background/95">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/dashboard/seller" className="flex items-center">
            {/* FIX: The problematic <span> wrapper around the <img> has been removed. */}
            <img src="/FinalLogo-withoutBG.png" alt="Logo" className="max-h-16" />
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/dashboard/seller" className="transition-colors hover:text-foreground/80 text-foreground">
              My Products
            </Link>
            <Link href="/dashboard/seller/orders" className="transition-colors hover:text-foreground/80 text-foreground">
              Orders Received
            </Link>
          </nav>
        </div>

        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="bg-[#BEA093] text-white hover:bg-[#FBF3E5] hover:text-[#BEA093]">
                <User className="h-5 w-5" />
                <span className="sr-only">User Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#FBF3E5]">
              <DropdownMenuLabel className="bg-[#BEA093] rounded-t-md">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="md:hidden">
                <DropdownMenuItem onClick={() => router.push('/dashboard/seller')}>
                  <Package className="mr-2 h-4 w-4" />
                  <span>My Products</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/dashboard/seller/orders')}>
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  <span>Orders Received</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </div>
              <DropdownMenuItem onClick={() => router.push('/dashboard/seller/profile')}>Profile</DropdownMenuItem>
              <DropdownMenuItem>Analytics</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}