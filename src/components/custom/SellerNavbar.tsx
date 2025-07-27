"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut } from 'lucide-react';
import { NotificationBell } from './NotificationBell';

export function SellerNavbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout');
    router.push('/');
  };

  return (
    <header className="sticky top-2 z-50 w-full border rounded-lg px-8 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 max-w-7xl">
      <div className="container flex h-16 items-center">
        {/* Logo and navigation links */}
        <div className="mr-4 flex items-center">
          <Link href="/dashboard/seller" className="mr-6 flex items-center space-x-2">
            <span className="font-bold sm:inline-block">
              <img src="/FinalLogo-withoutBG.png" alt="Thelo" className="max-h-16" />
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/dashboard/seller"
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              My Products
            </Link>
            <Link
              href="/dashboard/seller/orders"
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              Orders Received
            </Link>
          </nav>
        </div>

        {/* Right side user controls */}
        <div className="flex flex-1 items-center justify-end space-x-2">
          <NotificationBell role="seller" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="bg-[#BEA093] text-white hover:bg-[#FBF3E5] hover:text-[#BEA093]"
              >
                <User className="h-5 w-5" />
                <span className="sr-only">User Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#FBF3E5]">
              <DropdownMenuLabel className="bg-[#BEA093] rounded-t-lg">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/dashboard/seller/profile')}>
                Profile
              </DropdownMenuItem>
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
