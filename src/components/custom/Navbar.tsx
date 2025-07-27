"use client";

import Link from 'next/link';
import Image from 'next/image';
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { NotificationBell } from './NotificationBell';

export function Navbar() {
  const router = useRouter();
  const { cartItems } = useCart();

  const handleLogout = async () => {
    await fetch('/api/auth/logout');
    router.push('/');
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);

  return (
    <header className="sticky top-2 z-50 w-full px-8 center max-w-7xl border rounded-lg bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Main logo and navigation */}
        <div className="mr-4 flex items-center">
          <Link href="/dashboard/shopkeeper" className="mr-6 flex items-center space-x-2">
            <span className="font-bold sm:inline-block">
              <img src="/FinalLogo-withoutBG.png" alt="Thelo" className="max-h-16" />
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/dashboard/shopkeeper"
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              Marketplace
            </Link>
            <Link
              href="/dashboard/shopkeeper/orders"
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              My Orders
            </Link>
          </nav>
        </div>

        {/* Right side actions: notification, cart, user menu */}
        <div className="flex flex-1 items-center justify-end space-x-2">
          <NotificationBell role="shopkeeper" />

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative bg-[#BEA093] text-white hover:bg-[#FBF3E5] hover:text-[#BEA093]"
              >
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {cartItemCount}
                  </span>
                )}
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Shopping Cart</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-[#FBF3E5] p-6 rounded-l-lg">
              <SheetHeader className="bg-[#BEA093] rounded-tl-lg">
                <SheetTitle>Your Cart</SheetTitle>
                <SheetDescription className="sr-only">A list of items in your cart.</SheetDescription>
              </SheetHeader>
              <div className="mt-4 flex flex-col h-full">
                {cartItems.length > 0 ? (
                  <>
                    <div className="flex-grow overflow-y-auto pr-4">
                      {cartItems.map((item) => (
                        <div
                          key={item.product._id}
                          className="flex items-center gap-4 py-4 px-4 bg-[#FDFBF4] rounded-lg mb-2"
                        >
                          <Image
                            src={item.product.imageUrl || 'https://placehold.co/64x64'}
                            alt={item.product.name}
                            width={64}
                            height={64}
                            className="rounded-md h-14 w-14"
                          />
                          <div className="flex-grow">
                            <p className="font-semibold">{item.product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity} x ₹{item.product.price.toFixed(2)}
                            </p>
                          </div>
                          <p className="font-bold">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                    <SheetFooter className="mt-auto border-t pt-4">
                      <div className="w-full">
                        <div className="flex justify-between font-bold text-lg mb-4">
                          <span>Subtotal</span>
                          <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <Button
                          size="lg"
                          className="w-full bg-[#BEA093] hover:bg-[#FBF3E5] hover:text-[#BEA093]"
                          asChild
                        >
                          <Link href="/checkout">Proceed to Checkout</Link>
                        </Button>
                      </div>
                    </SheetFooter>
                  </>
                ) : (
                  <p className="text-center text-muted-foreground mt-8">Your cart is empty.</p>
                )}
              </div>
            </SheetContent>
          </Sheet>

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
              <DropdownMenuItem onClick={() => router.push('/dashboard/shopkeeper/profile')}>
                Profile
              </DropdownMenuItem>
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
