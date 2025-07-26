/*
* =================================================================================================
* FILE: src/components/custom/ProductCard.tsx
*
* This component displays a single product in the marketplace grid.
* It's designed to be reusable and show key information clearly.
* =================================================================================================
*/
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Mock data structure for a product. We will get this from the API later.
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
    <Card className="flex flex-col">
      <CardHeader>
        <div className="relative aspect-square w-full overflow-hidden rounded-lg">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            // Fallback for broken images
            // onError={(e) => { e.currentTarget.src =  }}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardTitle className="text-lg font-semibold">{product.name}</CardTitle>
        <CardDescription className="mt-1 text-sm">
          by {product.seller.brandName} - {product.seller.location}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <p className="text-xl font-bold">₹{product.price.toFixed(2)}</p>
        <Button>Add to Cart</Button>
      </CardFooter>
    </Card>
  );
}
