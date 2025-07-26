/*
* =================================================================================================
* FILE: src/app/dashboard/seller/page.tsx
*
* ACTION: Replace the code in this file.
* This is the complete Seller Dashboard. It handles image uploads and displays the
* image in the "My Products" list.
* =================================================================================================
*/
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Loader2, MoreHorizontal, Trash2, Pencil } from 'lucide-react';
import Image from 'next/image';

// --- Helper function to convert a file to a Base64 string ---
const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

function FormMessage({ type, message }: { type: 'error' | 'success', message: string }) { if (!message) return null; const color = type === 'error' ? 'text-red-600' : 'text-green-600'; return <p className={`text-sm font-medium ${color}`}>{message}</p>; }
function CreateProfileView({ onProfileCreated }: { onProfileCreated: () => void }) { const [error, setError] = useState(""); const [loading, setLoading] = useState(false); const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); setLoading(true); setError(""); const formData = new FormData(event.currentTarget); const profileData = { brandName: formData.get("brandName") as string, businessAddress: formData.get("businessAddress") as string, gstNumber: formData.get("gstNumber") as string }; try { const response = await fetch('/api/profiles', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profileData) }); const data = await response.json(); if (!response.ok) throw new Error(data.message || "Failed to create profile."); onProfileCreated(); } catch (err: any) { setError(err.message); } finally { setLoading(false); } }; return (<div className="w-full max-w-2xl mx-auto py-12"><Card><CardHeader><CardTitle>Create Your Seller Profile</CardTitle><CardDescription>This information is required before you can add products.</CardDescription></CardHeader><CardContent><form onSubmit={handleSubmit}><div className="grid gap-4"><div className="grid gap-2"><Label htmlFor="brandName">Brand Name</Label><Input id="brandName" name="brandName" placeholder="e.g., Acme Fresh Goods" required /></div><div className="grid gap-2"><Label htmlFor="businessAddress">Business Address</Label><Input id="businessAddress" name="businessAddress" placeholder="123 Business Rd, Business City" required /></div><div className="grid gap-2"><Label htmlFor="gstNumber">GST Number (Optional)</Label><Input id="gstNumber" name="gstNumber" placeholder="22AAAAA0000A1Z5" /></div>{error && <FormMessage type="error" message={error} />}<Button type="submit" className="w-full" disabled={loading}>{loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Profile'}</Button></div></form></CardContent></Card></div>); }

function ManageProductsView() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<any | null>(null);
    const [productToDelete, setProductToDelete] = useState<any | null>(null);
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const fetchMyProducts = useCallback(async () => { setIsLoadingProducts(true); try { const response = await fetch('/api/products/my-products'); const data = await response.json(); if (!response.ok) throw new Error(data.message || "Failed to fetch products."); setProducts(data.products); } catch (err: any) { console.error(err.message); setProducts([]); } finally { setIsLoadingProducts(false); } }, []);
    useEffect(() => { fetchMyProducts(); }, [fetchMyProducts]);

    const handleOpenForm = (product: any | null) => { setProductToEdit(product); setError(''); setIsFormOpen(true); };
    const handleOpenAlert = (product: any) => { setProductToDelete(product); setIsAlertOpen(true); };

    const handleSaveProduct = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); setError(''); setIsSaving(true);
        const form = event.currentTarget;
        const formData = new FormData(form);
        const imageFile = formData.get('image') as File;
        let imageUrl = productToEdit?.imageUrl || '';

        if (imageFile && imageFile.size > 0) {
            try { imageUrl = await toBase64(imageFile); } catch (err: any) { setError(`Image Error: ${err.message}`); setIsSaving(false); return; }
        }

        const productData = { name: formData.get('name') as string, description: formData.get('description') as string, price: Number(formData.get('price')), stock: Number(formData.get('stock')), status: formData.get('status') as string, category: formData.get('category') as string, location: formData.get('location') as string, imageUrl };
        const isEditing = !!productToEdit;
        const url = isEditing ? `/api/products/${productToEdit._id}` : '/api/products';
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(productData) });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || `Failed to ${isEditing ? 'update' : 'add'} product.`);
            setIsFormOpen(false); setProductToEdit(null); form.reset(); fetchMyProducts();
        } catch (err: any) { setError(err.message); } finally { setIsSaving(false); }
    };

    const handleDeleteProduct = async () => { if (!productToDelete) return; try { const response = await fetch(`/api/products/${productToDelete._id}`, { method: 'DELETE' }); const data = await response.json(); if (!response.ok) throw new Error(data.message || 'Failed to delete product.'); fetchMyProducts(); } catch (err: any) { console.error(err); } };

    return (
        <>
            <div className="flex items-center justify-between mb-8">
                <div><h1 className="text-3xl font-bold">My Products</h1><p className="text-muted-foreground">Manage your inventory and view product status.</p></div>
                <Button onClick={() => handleOpenForm(null)}><PlusCircle className="mr-2 h-4 w-4" />Add New Product</Button>
            </div>
            <div className="rounded-lg border bg-card">
                <Table>
                    <TableHeader><TableRow><TableHead className="w-[80px]">Image</TableHead><TableHead>Product Name</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Price</TableHead><TableHead className="text-right">Stock</TableHead><TableHead className="w-[50px]">Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {isLoadingProducts ? (<TableRow><TableCell colSpan={6} className="text-center h-24"><Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" /></TableCell></TableRow>)
                        : products.length > 0 ? (products.map((product) => (
                            <TableRow key={product._id}>
                                <TableCell><div className="relative h-16 w-16 rounded-md overflow-hidden"><Image src={product.imageUrl || 'https://placehold.co/64x64/eee/ccc?text=No+Image'} alt={product.name} fill className="object-cover"/></div></TableCell>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell><span className={`px-2 py-1 text-xs font-medium rounded-full ${product.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{product.status}</span></TableCell>
                                <TableCell className="text-right">₹{product.price.toFixed(2)}</TableCell>
                                <TableCell className="text-right">{product.stock}</TableCell>
                                <TableCell>
                                    <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => handleOpenForm(product)}><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-red-600" onClick={() => handleOpenAlert(product)}><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))) : (<TableRow><TableCell colSpan={6} className="text-center h-24">You haven't added any products yet.</TableCell></TableRow>)}
                    </TableBody>
                </Table>
            </div>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader><DialogTitle>{productToEdit ? 'Edit Product' : 'Add a New Product'}</DialogTitle><DialogDescription>Fill in the details below. Click save when you're done.</DialogDescription></DialogHeader>
                    <form onSubmit={handleSaveProduct}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="name" className="text-right">Name</Label><Input id="name" name="name" defaultValue={productToEdit?.name} className="col-span-3" required /></div>
                            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="description" className="text-right">Description</Label><Textarea id="description" name="description" defaultValue={productToEdit?.description} className="col-span-3" required /></div>
                            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="category" className="text-right">Category</Label><Input id="category" name="category" defaultValue={productToEdit?.category} className="col-span-3" placeholder="e.g., Grains, Spices" required /></div>
                            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="price" className="text-right">Price (₹)</Label><Input id="price" name="price" type="number" defaultValue={productToEdit?.price} className="col-span-3" required /></div>
                            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="stock" className="text-right">Stock</Label><Input id="stock" name="stock" type="number" defaultValue={productToEdit?.stock} className="col-span-3" required /></div>
                            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="location" className="text-right">Location</Label><Input id="location" name="location" defaultValue={productToEdit?.location} className="col-span-3" placeholder="e.g., Nashik, Maharashtra" required /></div>
                            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="status" className="text-right">Status</Label><select id="status" name="status" defaultValue={productToEdit?.status || 'Active'} className="col-span-3 flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"><option value="Active">Active</option><option value="Archived">Archived</option></select></div>
                            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="image" className="text-right">Image</Label><Input id="image" name="image" type="file" className="col-span-3" accept="image/*" /></div>
                        </div>
                        {error && <p className="text-sm text-red-600 mb-4 text-center">{error}</p>}
                        <DialogFooter><Button type="submit" disabled={isSaving}>{isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Changes'}</Button></DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the product "{productToDelete?.name}".</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDeleteProduct} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
        </>
    );
}

export default function SellerDashboard() {
    const [profileExists, setProfileExists] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const checkProfile = useCallback(async () => { setIsLoading(true); try { const response = await fetch('/api/profiles'); if (response.ok) { setProfileExists(true); } else { setProfileExists(false); } } catch (error) { console.error("Failed to check profile", error); setProfileExists(false); } finally { setIsLoading(false); } }, []);
    useEffect(() => { checkProfile(); }, [checkProfile]);
    if (isLoading) { return (<div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>); }
    return (<div className="container py-8">{profileExists ? <ManageProductsView /> : <CreateProfileView onProfileCreated={checkProfile} />}</div>);
}
