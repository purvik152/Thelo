/*
* =================================================================================================
* FILE: src/app/api/products/route.ts
*
* ACTION: Replace the code in this file.
* This is the updated, more robust version of your Product API.
* It includes better error handling to prevent crashes and provide clear messages.
* =================================================================================================
*/
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import Product from '@/models/Product';
import SellerProfile from '@/models/SellerProfile';

interface DecodedToken {
  id: string;
  role: string;
}

// --- POST: For Sellers to create a new product (Updated & More Robust) ---
export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    // 1. Authenticate the user and check their role
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Authentication required. Please log in again.' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    if (decoded.role !== 'seller') {
      return NextResponse.json({ message: 'Forbidden: Only sellers can add products.' }, { status: 403 });
    }

    // 2. **CRITICAL FIX**: Find the seller's profile to link the product to.
    // If the profile doesn't exist, return a clear error instead of crashing.
    const sellerProfile = await SellerProfile.findOne({ user: decoded.id });
    if (!sellerProfile) {
      return NextResponse.json({ message: 'Seller profile not found. Please create your seller profile first before adding products.' }, { status: 404 });
    }

    // 3. Get the product data from the request
    const body = await request.json();
    const { name, description, price, category, stock, location } = body;

    // 4. Validate that all required fields are present
    if (!name || !description || !price || !category || !stock || !location) {
        return NextResponse.json({ message: 'All fields are required to create a product.' }, { status: 400 });
    }

    // 5. Create and save the new product
    const newProduct = new Product({
      seller: sellerProfile._id, // Link to the seller's profile
      name,
      description,
      price,
      category,
      stock,
      location,
      status: 'Active',
      imageUrl: `https://placehold.co/400x400/e2e8f0/475569?text=${name.replace(/\s/g, '+')}` // Placeholder image
    });

    await newProduct.save();
    
    // 6. Send a success response
    return NextResponse.json({ message: 'Product added successfully!', product: newProduct }, { status: 201 });

  } catch (error: any) {
    console.error('PRODUCT_POST_ERROR', error);
    // Provide a generic but helpful error message
    return NextResponse.json({ message: 'An internal server error occurred while adding the product.' }, { status: 500 });
  }
}

// --- GET: For Shopkeepers to fetch all active products (No changes needed here) ---
export async function GET(request: NextRequest) {
    await dbConnect();
    try {
        const products = await Product.find({ status: 'Active' })
            .populate({
                path: 'seller',
                select: 'brandName',
                model: SellerProfile
            })
            .sort({ createdAt: -1 });

        return NextResponse.json({ success: true, products }, { status: 200 });

    } catch (error) {
        console.error('PRODUCT_GET_ERROR', error);
        return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
    }
}
