/*
* =================================================================================================
* FILE: src/app/dashboard/seller/page.tsx
*
* ACTION: Replace the code in this file.
* This is the complete, intelligent Seller Dashboard. It will first prompt you to create
* a profile. Once the profile is created, it will show you the product management view.
* This solves the "Seller profile not found" error.
* =================================================================================================
*/
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Loader2 } from 'lucide-react';

// --- Reusable Form Message Component ---
function FormMessage({ type, message }: { type: 'error' | 'success', message: string }) {
    if (!message) return null;
    const color = type === 'error' ? 'text-red-600' : 'text-green-600';
    return <p className={`text-sm font-medium ${color}`}>{message}</p>;
}

// --- View #1: The Form to Create a Seller Profile ---
function CreateProfileView({ onProfileCreated }: { onProfileCreated: () => void }) {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(event.currentTarget);
        const profileData = {
            brandName: formData.get("brandName") as string,
            businessAddress: formData.get("businessAddress") as string,
            gstNumber: formData.get("gstNumber") as string,
        };

        try {
            const response = await fetch('/api/profiles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to create profile.");
            
            // Tell the parent component that the profile was created successfully
            onProfileCreated();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto py-12">
            <Card>
                <CardHeader>
                    <CardTitle>Create Your Seller Profile</CardTitle>
                    <CardDescription>This information is required before you can add products. It will be visible to shopkeepers.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4">
                            <div className="grid gap-2"><Label htmlFor="brandName">Brand Name</Label><Input id="brandName" name="brandName" placeholder="e.g., Acme Fresh Goods" required /></div>
                            <div className="grid gap-2"><Label htmlFor="businessAddress">Business Address</Label><Input id="businessAddress" name="businessAddress" placeholder="123 Business Rd, Business City" required /></div>
                            <div className="grid gap-2"><Label htmlFor="gstNumber">GST Number (Optional)</Label><Input id="gstNumber" name="gstNumber" placeholder="22AAAAA0000A1Z5" /></div>
                            {error && <FormMessage type="error" message={error} />}
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Profile'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

// --- View #2: The Main Product Management Dashboard ---
function ManageProductsView() {
    const [products, setProducts] = useState([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [error, setError] = useState('');

    const fetchMyProducts = useCallback(async () => {
        setIsLoadingProducts(true);
        try {
            const response = await fetch('/api/products/my-products');
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to fetch products.");
            setProducts(data.products);
        } catch (err: any) {
            console.error(err.message);
            setProducts([]);
        } finally {
            setIsLoadingProducts(false);
        }
    }, []);

    useEffect(() => {
        fetchMyProducts();
    }, [fetchMyProducts]);

    const handleAddProduct = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        const formData = new FormData(event.currentTarget);
        const productData = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            price: Number(formData.get('price')),
            category: formData.get('category') as string,
            stock: Number(formData.get('stock')),
            location: formData.get('location') as string,
        };

        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to add product.");
            
            setIsDialogOpen(false);
            fetchMyProducts();
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">My Products</h1>
                    <p className="text-muted-foreground">Manage your inventory and view product status.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4" />Add New Product</Button></DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader><DialogTitle>Add a New Product</DialogTitle><DialogDescription>Fill in the details below. This will be visible to all shopkeepers.</DialogDescription></DialogHeader>
                        <form onSubmit={handleAddProduct}>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="name" className="text-right">Name</Label><Input id="name" name="name" className="col-span-3" required /></div>
                                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="description" className="text-right">Description</Label><Textarea id="description" name="description" className="col-span-3" required /></div>
                                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="category" className="text-right">Category</Label><Input id="category" name="category" className="col-span-3" placeholder="e.g., Grains, Spices" required /></div>
                                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="price" className="text-right">Price (₹)</Label><Input id="price" name="price" type="number" className="col-span-3" required /></div>
                                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="stock" className="text-right">Stock</Label><Input id="stock" name="stock" type="number" className="col-span-3" required /></div>
                                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="location" className="text-right">Location</Label><Input id="location" name="location" className="col-span-3" placeholder="e.g., Nashik, Maharashtra" required /></div>
                            </div>
                            {error && <p className="text-sm text-red-600 mb-4 text-center">{error}</p>}
                            <DialogFooter><Button type="submit">Save Product</Button></DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="rounded-lg border bg-card">
                <Table>
                    <TableHeader><TableRow><TableHead>Product Name</TableHead><TableHead>Status</TableHead><TableHead>Location</TableHead><TableHead className="text-right">Price</TableHead><TableHead className="text-right">Stock</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {isLoadingProducts ? (<TableRow><TableCell colSpan={5} className="text-center h-24">Loading your products...</TableCell></TableRow>) : products.length > 0 ? (products.map((product: any) => (<TableRow key={product._id}><TableCell className="font-medium">{product.name}</TableCell><TableCell><span className={`px-2 py-1 text-xs font-medium rounded-full ${product.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{product.status}</span></TableCell><TableCell>{product.location}</TableCell><TableCell className="text-right">₹{product.price.toFixed(2)}</TableCell><TableCell className="text-right">{product.stock}</TableCell></TableRow>))) : (<TableRow><TableCell colSpan={5} className="text-center h-24">You haven't added any products yet.</TableCell></TableRow>)}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}

// --- Main Intelligent Dashboard Component ---
export default function SellerDashboard() {
    const [profileExists, setProfileExists] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const checkProfile = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/profiles');
            if (response.ok) {
                setProfileExists(true);
            } else {
                setProfileExists(false);
            }
        } catch (error) {
            console.error("Failed to check profile", error);
            setProfileExists(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        checkProfile();
    }, [checkProfile]);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="container py-8">
            {profileExists ? <ManageProductsView /> : <CreateProfileView onProfileCreated={checkProfile} />}
        </div>
    );
}
