import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import SellerProfile from '@/models/SellerProfile';
import Product from '@/models/Product';
import mongoose from 'mongoose'; // Import mongoose

interface DecodedToken {
    id: string;
    role: string;
}

// This function handles updating the order status
export async function PUT(request: NextRequest, { params }: { params: { orderId: string } }) {
    await dbConnect();
    try {
        const { orderId } = params;
        const { status } = await request.json();

        if (!status) {
            return NextResponse.json({ message: 'Status is required' }, { status: 400 });
        }

        // 1. Authenticate the seller
        const token = (await cookies()).get('token')?.value;
        if (!token) {
            return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
        if (decoded.role !== 'seller') {
            return NextResponse.json({ message: 'Forbidden: Access denied' }, { status: 403 });
        }

        // 2. Find the order and verify the seller owns at least one product in it
        const order = await Order.findById(orderId);
        if (!order) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        const sellerProfile = await SellerProfile.findOne({ user: decoded.id });
        if (!sellerProfile) {
            return NextResponse.json({ message: 'Seller profile not found' }, { status: 404 });
        }

        const sellerProducts = await Product.find({ seller: sellerProfile._id }).select('_id');
        const sellerProductIds = sellerProducts.map(p => p._id.toString());
        
        // --- THIS IS THE FIX ---
        // Explicitly type the order items to help TypeScript
        const orderProductIds = (order.items as { product: mongoose.Types.ObjectId }[]).map(item => item.product.toString());

        const isSellerOrder = orderProductIds.some(id => sellerProductIds.includes(id));

        if (!isSellerOrder) {
            return NextResponse.json({ message: 'Forbidden: You do not own this order' }, { status: 403 });
        }

        // 3. Update the order status
        order.status = status;
        await order.save();

        return NextResponse.json({ success: true, order });

    } catch (error) {
        console.error("UPDATE_ORDER_STATUS_ERROR", error);
        return NextResponse.json({ message: 'Failed to update order status' }, { status: 500 });
    }
}