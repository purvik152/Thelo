import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import Notification from '@/models/Notification';

interface DecodedToken {
  id: string;
  role: string;
}
interface Body {
  status: string;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  await dbConnect();

  try {
    const orderId = params.orderId;
    const { status } = (await request.json()) as Body;

    const token = (await cookies()).get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    if (decoded.role !== 'seller') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    const order = await Order.findById(orderId);
    if (!order) return NextResponse.json({ message: 'Order not found' }, { status: 404 });

    order.status = status;
    await order.save();

    try {
      await new Notification({
        user: order.customer,
        message: `Your order (#${order._id.toString().slice(-6).toUpperCase()}) changed to ${status}.`,
        link: '/dashboard/shopkeeper/orders'
      }).save();
    } catch (nErr) {
      console.error('NOTIFICATION FAILED', nErr instanceof Error ? nErr.message : nErr);
    }

    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error('UPDATE_ORDER_ERROR', err instanceof Error ? err.message : err);
    return NextResponse.json({ message: 'Failed to update order' }, { status: 500 });
  }
}
