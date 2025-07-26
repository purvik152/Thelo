import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ShopkeeperDashboard() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="text-center p-10 border rounded-lg bg-white shadow-xl">
        <h1 className="text-4xl font-bold text-blue-600">Shopkeeper Dashboard</h1>
        <p className="mt-3 text-lg text-gray-700">
          Welcome! You can browse products and manage your purchases here.
        </p>
        <Button asChild className="mt-6" size="lg">
            <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}