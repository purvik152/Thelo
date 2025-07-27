import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import jwt from 'jsonwebtoken';
import Product from '@/models/Product';
import SellerProfile from '@/models/SellerProfile';
import { cookies } from 'next/headers';

interface DecodedToken {
  id: string;
  role: string;
}

interface ProductPostBody {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  location: string;
  imageUrl: string;
}

interface ProductQuery {
  status: 'Active';
  $or?: Array<{ name: { $regex: string; $options: string } } | { category: { $regex: string; $options: string } }>;
  location?: { $regex: string; $options: string };
}

export const config = { api: { bodyParser: { sizeLimit: '5mb' } } };

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const token = cookies().get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    if (decoded.role !== 'seller') return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });

    const sellerProfile = await SellerProfile.findOne({ user: decoded.id });
    if (!sellerProfile) return NextResponse.json({ message: 'Seller profile missing' }, { status: 404 });

    const body = (await request.json()) as ProductPostBody;
    const { name, description, price, category, stock, location, imageUrl } = body;

    const newProduct = new Product({
      seller: sellerProfile._id,
      name,
      description,
      price,
      category,
      stock,
      location,
      status: 'Active',
      imageUrl,
    });

    await newProduct.save();

    return NextResponse.json({ message: 'Product added!', product: newProduct }, { status: 201 });
  } catch (err) {
    console.error('PRODUCT_POST_ERROR', err instanceof Error ? err.message : err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const url = new URL(request.url);
    const search = url.searchParams.get('search') ?? undefined;
    const location = url.searchParams.get('location') ?? undefined;

    const query: ProductQuery = { status: 'Active' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const products = await Product.find(query)
      .populate({ path: 'seller', model: SellerProfile, select: 'brandName' })
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, products });
  } catch (err) {
    console.error('PRODUCT_GET_ERROR', err instanceof Error ? err.message : err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
