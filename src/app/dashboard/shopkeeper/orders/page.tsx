"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

// Interfaces
interface PopulatedOrderItem {
  product: {
    _id: string;
    name: string;
    imageUrl?: string;
  };
  quantity: number;
  price: number;
}

interface PopulatedOrder {
  _id: string;
  createdAt: string;
  status: string;
  totalAmount: number;
  items: PopulatedOrderItem[];
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<PopulatedOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch('/api/orders/my-orders');
        const data = await response.json();
        if (response.ok && data.success) {
          setOrders(data.orders);
        } else {
          setError(data.message || "Failed to load orders.");
        }
      } catch (err) {
        setError("Failed to fetch orders.");
        console.error("Failed to fetch orders:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const getBadgeVariant = (status: string): "secondary" | "default" | "destructive" | "outline" => {
    switch (status) {
      case 'Pending': return 'secondary';
      case 'Shipped': return 'default';
      case 'Delivered': return 'secondary';
      case 'Cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 max-w-7xl bg-white">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        <div className="space-y-6">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 max-w-7xl bg-white text-center text-red-600">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-7xl px-16 bg-white">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map(order => (
            <Card key={order._id} className="pt-0">
              <CardHeader className="flex flex-row justify-between items-center bg-[#BEA093] p-4 border border-[#BEA093] rounded-t-lg">
                <div>
                  <CardTitle>Order #{order._id.toString().slice(-6).toUpperCase()}</CardTitle>
                  <p className="text-sm text-muted-foreground text-white pt-2">
                    Placed on: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge
                  variant={getBadgeVariant(order.status)}
                  className="bg-[#FBF3E5] text-black hover:bg-[#BEA093] hover:text-[#FBF3E5]"
                >
                  {order.status}
                </Badge>
              </CardHeader>
              <CardContent className="p-4">
                {order.items.map(item => (
                  <div
                    key={item.product._id}
                    className="flex items-center gap-10 py-0 px-6 border-b last:border-b-0 mb-2 pb-2"
                  >
                    <Image
                      src={item.product.imageUrl || 'https://placehold.co/64x64'}
                      alt={item.product.name}
                      width={50}
                      height={50}
                      className="rounded-md object-cover h-24 w-24"
                    />
                    <div className="flex-grow">
                      <p className="font-semibold text-xl">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} x ₹{item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="flex justify-end font-bold text-lg bg-gray-50 p-4">
                <span>Total:</span>
                <span className="ml-2">₹{order.totalAmount.toFixed(2)}</span>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-dashed border-2 rounded-lg">
          <h2 className="text-xl font-semibold">You haven't placed any orders yet.</h2>
          <p className="text-muted-foreground mt-2">Your placed orders will appear here.</p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/shopkeeper">Start Shopping</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
