/*
* =================================================================================================
* FILE: src/app/api/products/route.ts
*
* ACTION: Replace the code in this file.
* This version adds a configuration to increase the request body size limit,
* which will allow larger Base64 image strings to be saved correctly.
* =================================================================================================
*/
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import Product from '@/models/Product';
import SellerProfile from '@/models/SellerProfile';

// --- THIS IS THE FIX ---
// Increase the body parser size limit for this specific API route.
// 5mb is a good limit for image uploads.
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '5mb',
        },
    },
};
// -----------------------

interface DecodedToken { id: string; role: string; }

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) { return NextResponse.json({ message: 'Authentication required.' }, { status: 401 }); }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    if (decoded.role !== 'seller') { return NextResponse.json({ message: 'Forbidden: Only sellers can add products.' }, { status: 403 }); }
    const sellerProfile = await SellerProfile.findOne({ user: decoded.id });
    if (!sellerProfile) { return NextResponse.json({ message: 'Seller profile not found.' }, { status: 404 }); }
    
    const body = await request.json();
    const { name, description, price, category, stock, location, imageUrl } = body;

    const newProduct = new Product({ seller: sellerProfile._id, name, description, price, category, stock, location, status: 'Active', imageUrl });
    await newProduct.save();
    return NextResponse.json({ message: 'Product added successfully!', product: newProduct }, { status: 201 });
  } catch (error: any) {
    console.error('PRODUCT_POST_ERROR', error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
    await dbConnect();
    try {
        const products = await Product.find({ status: 'Active' }).populate({ path: 'seller', select: 'brandName', model: SellerProfile }).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, products }, { status: 200 });
    } catch (error) {
        console.error('PRODUCT_GET_ERROR', error);
        return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
    }
}
