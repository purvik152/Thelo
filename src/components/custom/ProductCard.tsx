/*
* =================================================================================================
* FILE: src/components/custom/ProductCard.tsx
*
* ACTION: No changes needed. Just verify your code matches this.
* This card correctly displays the Base64 image string from the database.
* =================================================================================================
*/
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  seller: {
    brandName: string;
    location: string;
  };
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative aspect-video w-full">
          <Image
            src={product.imageUrl || 'https://placehold.co/400x225/eee/ccc?text=Image+Not+Available'}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="text-lg font-semibold leading-tight">{product.name}</CardTitle>
        <CardDescription className="mt-1 text-sm">
          by {product.seller.brandName}
        </CardDescription>
        <p className="text-xs text-muted-foreground mt-1">{product.seller.location}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <p className="text-xl font-bold">₹{product.price.toFixed(2)}</p>
        <Button>Add to Cart</Button>
      </CardFooter>
    </Card>
  );
}
