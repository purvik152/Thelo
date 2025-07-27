import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

interface DecodedToken {
    id: string;
}

export async function POST(request: NextRequest) {
    console.log("ORDER API: Received a request.");
    try {
        await dbConnect();
        console.log("ORDER API: Database connection successful.");

        const token = (await cookies()).get('token')?.value;
        if (!token) {
            console.error("ORDER API: Authentication failed - No token found.");
            return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
        }
        console.log("ORDER API: Token found.");

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
        const customerId = decoded.id;
        console.log(`ORDER API: Token decoded for customer ID: ${customerId}`);

        const body = await request.json();
        console.log("ORDER API: Request body parsed:", body);
        
        const { items, totalAmount, shippingAddress, mobileNumber } = body;

        if (!items || !totalAmount || !shippingAddress || !mobileNumber) {
            console.error("ORDER API: Validation failed - Missing fields in body.");
            return NextResponse.json({ message: 'Missing required order information.' }, { status: 400 });
        }

        const newOrder = new Order({
            customer: customerId,
            items,
            totalAmount,
            shippingAddress,
            mobileNumber,
        });
        console.log("ORDER API: New order object created.");

        await newOrder.save();
        console.log("ORDER API: Order saved to database successfully!");

        return NextResponse.json({ message: 'Order created successfully', order: newOrder }, { status: 201 });

    } catch (error: any) {
        console.error("--- ORDER API CRASH ---");
        console.error(error.message);
        console.error("-----------------------");
        return NextResponse.json({ message: 'Failed to create order on the server.' }, { status: 500 });
    }
}