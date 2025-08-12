import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Notification from '@/models/Notification';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
    await dbConnect();
    try {
        const token = (await cookies()).get('token')?.value;
        if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

        const notifications = await Notification.find({ user: decoded.id })
            .sort({ createdAt: -1 })
            .limit(10)
            .lean(); // Use lean() for better performance

        return NextResponse.json({
            success: true,
            notifications: notifications || []
        }, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            }
        });
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching notifications' }, { status: 500 });
    }
}
