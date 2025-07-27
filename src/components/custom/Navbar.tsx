/*
* =================================================================================================
* FILE: src/components/custom/Navbar.tsx
*
* ACTION: Verify or replace the code in this file.
* =================================================================================================
*/
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ShoppingCart, User, LogOut, Package } from 'lucide-react';

export function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    // This API route will need to be created to clear the cookie
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/dashboard/shopkeeper" className="mr-6 flex items-center space-x-2">
            <Package className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">Thelo</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/dashboard/shopkeeper" className="transition-colors hover:text-foreground/80 text-foreground">
              Marketplace
            </Link>
            <Link href="/dashboard/shopkeeper/orders" className="transition-colors hover:text-foreground/80 text-foreground/60">
              My Orders
            </Link>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Shopping Cart</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">User Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/dashboard/shopkeeper/profile')}>Profile</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
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
