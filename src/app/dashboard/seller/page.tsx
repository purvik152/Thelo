/*
* =================================================================================================
* FILE: src/app/dashboard/seller/page.tsx
*
* This is the main dashboard for the Seller. It features:
* 1. A dialog (modal) form to add a new product.
* 2. A table that lists all of the seller's current products.
* =================================================================================================
*/
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle } from 'lucide-react';

// Mock data for a seller's products. This will come from an API.
const mockSellerProducts = [
    { id: '1', name: 'Handmade Leather Wallets', price: 850, stock: 50, status: 'Active' },
    { id: '3', name: 'Block-Printed Cotton Sarees', price: 2500, stock: 25, status: 'Active' },
    { id: '7', name: 'Custom Engraved Pens', price: 350, stock: 120, status: 'Archived' },
];

export default function SellerProductsPage() {
    const [products, setProducts] = useState(mockSellerProducts);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // This function would handle the API call to save the new product
    const handleAddProduct = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const newProduct = {
            id: (Math.random() * 1000).toString(), // temporary id
            name: formData.get('name') as string,
            price: Number(formData.get('price')),
            stock: Number(formData.get('stock')),
            status: 'Active',
        };
        console.log("Adding new product:", newProduct);
        // Add to our mock list and close the dialog
        setProducts(prev => [...prev, newProduct]);
        setIsDialogOpen(false);
    };

    return (
        <div className="container py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">My Products</h1>
                    <p className="text-muted-foreground">Manage your inventory and view product status.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add New Product
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add a New Product</DialogTitle>
                            <DialogDescription>
                                Fill in the details below. Click save when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddProduct}>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">Name</Label>
                                    <Input id="name" name="name" className="col-span-3" placeholder="e.g., Leather Wallet" required />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="description" className="text-right">Description</Label>
                                    <Textarea id="description" name="description" className="col-span-3" placeholder="Describe your product..." />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="price" className="text-right">Price (₹)</Label>
                                    <Input id="price" name="price" type="number" className="col-span-3" placeholder="e.g., 850" required />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="stock" className="text-right">Stock</Label>
                                    <Input id="stock" name="stock" type="number" className="col-span-3" placeholder="e.g., 50" required />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit">Save Product</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Product Table */}
            <div className="rounded-lg border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-right">Stock</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 text-xs rounded-full ${product.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {product.status}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">₹{product.price.toFixed(2)}</TableCell>
                                <TableCell className="text-right">{product.stock}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {products.length === 0 && (
                <div className="text-center py-16">
                    <h2 className="text-2xl font-semibold">No products yet</h2>
                    <p className="text-muted-foreground mt-2">Click "Add New Product" to get started.</p>
                </div>
            )}
        </div>
    );
}
