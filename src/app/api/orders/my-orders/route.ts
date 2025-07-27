import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import Product from '@/models/Product';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

interface DecodedToken {
  id: string;
}

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    const customerId = decoded.id;

    const orders = await Order.find({ customer: customerId })
      .populate({ path: 'items.product', model: Product, select: 'name imageUrl' })
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, orders });
  } catch (err) {
    console.error('MY_ORDERS_ERROR', err instanceof Error ? err.message : err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
