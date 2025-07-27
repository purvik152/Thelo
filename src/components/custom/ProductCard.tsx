import Image from 'next/image';
import Link from 'next/link';
import { Card, CardTitle } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import { IProduct } from '@/models/Product';

// Interface for product data including the seller's details
interface PopulatedSeller {
  _id: string;
  brandName: string;
}

interface PopulatedProduct extends Omit<IProduct, 'seller'> {
  seller: PopulatedSeller;
}

interface ProductCardProps {
  product: PopulatedProduct;
  onSelect: () => void;
  isSelected: boolean;
}

export function ProductCard({ product, onSelect, isSelected }: ProductCardProps) {
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md w-full",
        isSelected ? "border-primary shadow-lg" : "border-transparent"
      )}
      onClick={onSelect}
    >
      <div className="flex items-start space-x-4 p-4">
        <div className="relative w-24 h-24 flex-shrink-0">
          <Image
            src={product.imageUrl || 'https://placehold.co/100x100/e2e8f0/475569?text=Image'}
            alt={product.name}
            fill
            className="rounded-md object-cover"
          />
        </div>
        <div className="flex-grow overflow-hidden">
          <p className="text-sm font-semibold text-primary truncate">{product.seller.brandName}</p>
          <CardTitle className="text-md font-bold mb-1 truncate">{product.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{product.location}</p>
          <p className="text-lg font-bold mt-2">${product.price.toFixed(2)}</p>
        </div>
      </div>
    </Card>
  );
}