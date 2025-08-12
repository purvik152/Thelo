"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
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
    <header className="sticky top-2 z-50 w-full px-8 center max-w-7xl border border-white/20 rounded-lg bg-white/80 backdrop-blur-xl shadow-lg shadow-black/5">
      <div className="container flex h-16 items-center">
        {/* MODIFICATION START: The main change is in this block */}
        <div className="mr-4 flex items-center group">
          <Link href="/dashboard/shopkeeper" className="mr-6 flex items-center space-x-2">
            <span className="font-bold sm:inline-block">
              <img src="/FinalLogo-withoutBG.png" alt="Thelo" className="max-h-16 transition-transform duration-300 group-hover:scale-105" />
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/dashboard/shopkeeper" className="relative px-3 py-2 rounded-lg transition-all duration-300 hover:text-[#BEA093] hover:bg-[#BEA093]/10 text-gray-700 font-medium">
              Marketplace
            </Link>
            <Link href="/dashboard/shopkeeper/orders" className="relative px-3 py-2 rounded-lg transition-all duration-300 hover:text-[#BEA093] hover:bg-[#BEA093]/10 text-gray-700 font-medium">
              My Orders
            </Link>
          </nav>
        </div>
        {/* MODIFICATION END */}

        <div className="flex flex-1 items-center justify-end space-x-2">
          <NotificationBell role="shopkeeper" />

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative bg-gradient-to-r from-[#BEA093] to-[#D4C4B0] text-white hover:from-[#D4C4B0] hover:to-[#BEA093] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-lg animate-pulse">
                    {cartItemCount}
                  </span>
                )}
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Shopping Cart</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-gradient-to-br from-[#FBF3E5] to-[#FDFBF4] p-6 rounded-l-lg border-l border-gray-200 shadow-2xl">
              <SheetHeader className="bg-[#BEA093] rounded-tl-lg">
                <SheetTitle>Your Cart</SheetTitle>
                <SheetDescription className="sr-only">A list of items in your cart.</SheetDescription>
              </SheetHeader>
              <div className="mt-4 flex flex-col h-full">
                {cartItems.length > 0 ? (
                  <>
                    <div className="flex-grow overflow-y-auto pr-4">
                      {cartItems.map(item => (
                        <div key={item.product._id} className="flex items-center gap-4 py-4 px-4 bg-[#FDFBF4] rounded-lg mb-2">
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
                          <p className="font-bold">
                            ₹{(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                    <SheetFooter className="mt-auto border-t pt-4">
                      <div className="w-full">
                        <div className="flex justify-between font-bold text-lg mb-4">
                          <span>Subtotal</span>
                          <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <Button size="lg" className="w-full bg-[#BEA093] hover:bg-[#FBF3E5] hover:text-[#BEA093]" asChild>
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
              <Button variant="ghost" size="icon" className="bg-gradient-to-r from-[#BEA093] to-[#D4C4B0] text-white hover:from-[#D4C4B0] hover:to-[#BEA093] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                <User className="h-5 w-5" />
                <span className="sr-only">User Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-lg">
              <DropdownMenuLabel className="bg-[#BEA093] rounded-t-lg">My Account</DropdownMenuLabel>
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
