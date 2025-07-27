/*
* =================================================================================================
* FILE: src/components/custom/ProductCard.tsx
*
* ACTION: Replace the code in this file.
* This is the updated, interactive version of your ProductCard. It is now designed
* to be used as a selectable item in a list.
* =================================================================================================
*/
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils"; // Import the cn utility

// This is our main Product interface for the frontend
export interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl?: string;
  description: string;
  category: string;
  location: string;
  stock: number;
  seller: {
    brandName: string;
  } | null;
}

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onSelect: () => void;
}

export function ProductCard({ product, isSelected, onSelect }: ProductCardProps) {
  const brandName = product.seller?.brandName || 'Unknown Seller';

  return (
    <Card
      onClick={onSelect}
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md",
        isSelected ? "border-primary shadow-md" : "border-border"
      )}
    >
      <CardContent className="p-3 flex items-start gap-4">
        <div className="relative aspect-square w-24 rounded-md overflow-hidden flex-shrink-0">
          <Image
            src={product.imageUrl || 'https://placehold.co/100x100/e2e8f0/475569?text=Image'}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center flex-grow">
          <h3 className="font-semibold text-md leading-tight">{product.name}</h3>
          <p className="text-sm text-muted-foreground">by {brandName}</p>
          <p className="text-lg font-bold mt-2">₹{product.price.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
