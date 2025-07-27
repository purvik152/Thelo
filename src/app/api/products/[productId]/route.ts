/*
* =================================================================================================
* FILE: src/app/api/products/[productId]/route.ts
*
* ACTION: Replace the code in this file to fix ESLint errors.
* =================================================================================================
*/
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import Product from '@/models/Product';
import SellerProfile from '@/models/SellerProfile';

export const config = { api: { bodyParser: { sizeLimit: '5mb' } } };
interface DecodedToken { id: string; role: string; }

export async function GET(request: NextRequest, { params }: { params: { productId: string } }) {
    await dbConnect();
    try {
        const { productId } = params;
        const product = await Product.findById(productId).populate({ path: 'seller', select: 'brandName', model: SellerProfile });
        if (!product) { return NextResponse.json({ message: 'Product not found.' }, { status: 404 }); }
        return NextResponse.json({ success: true, product }, { status: 200 });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
    }
}

async function getSellerAndVerify(token: string | undefined, productId: string) {
    if (!token) throw new Error('Authentication required.');
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    if (decoded.role !== 'seller') throw new Error('Forbidden: Access denied.');
    const sellerProfile = await SellerProfile.findOne({ user: decoded.id });
    if (!sellerProfile) throw new Error('Seller profile not found.');
    const product = await Product.findById(productId);
    if (!product) throw new Error('Product not found.');
    if (product.seller.toString() !== sellerProfile._id.toString()) { throw new Error('Forbidden: You do not own this product.'); }
    return { product, sellerProfile };
}

export async function PUT(request: NextRequest, { params }: { params: { productId: string } }) {
    await dbConnect();
    try {
        const token = (await cookies()).get('token')?.value;
        const { productId } = params;
        await getSellerAndVerify(token, productId);
        const body = await request.json();
        const updatedProduct = await Product.findByIdAndUpdate(productId, body, { new: true, runValidators: true });
        return NextResponse.json({ message: 'Product updated successfully!', product: updatedProduct }, { status: 200 });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return NextResponse.json({ message: errorMessage }, { status: errorMessage.includes('Forbidden') ? 403 : 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { productId: string } }) {
    await dbConnect();
    try {
        const token = (await cookies()).get('token')?.value;
        const { productId } = params;
        await getSellerAndVerify(token, productId);
        await Product.findByIdAndDelete(productId);
        return NextResponse.json({ message: 'Product deleted successfully!' }, { status: 200 });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return NextResponse.json({ message: errorMessage }, { status: errorMessage.includes('Forbidden') ? 403 : 500 });
    }
}
