import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Notification from '@/models/Notification';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
    try {
        // Connect to database
        await dbConnect();

        // Get and validate token
        const token = (await cookies()).get('token')?.value;
        if (!token) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized - No token provided'
            }, { status: 401 });
        }

        // Verify JWT token
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET environment variable is not set');
            return NextResponse.json({
                success: false,
                message: 'Server configuration error'
            }, { status: 500 });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
        } catch (jwtError) {
            console.error('JWT verification failed:', jwtError);
            return NextResponse.json({
                success: false,
                message: 'Invalid token'
            }, { status: 401 });
        }

        if (!decoded.id) {
            return NextResponse.json({
                success: false,
                message: 'Invalid token payload'
            }, { status: 401 });
        }

        // Validate user ID format
        if (!decoded.id || typeof decoded.id !== 'string') {
            return NextResponse.json({
                success: false,
                message: 'Invalid user ID in token'
            }, { status: 400 });
        }

        // Fetch notifications with error handling
        let notifications;
        try {
            notifications = await Notification.find({ user: decoded.id })
                .sort({ createdAt: -1 })
                .limit(10)
                .lean();
        } catch (dbError) {
            console.error('Database query error:', dbError);
            return NextResponse.json({
                success: false,
                message: 'Database query failed'
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            notifications: Array.isArray(notifications) ? notifications : []
        }, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            }
        });
    } catch (error) {
        console.error('Notifications API Error:', error);
        return NextResponse.json({
            success: false,
            message: 'Error fetching notifications',
            error: process.env.NODE_ENV === 'development' ? String(error) : undefined
        }, { status: 500 });
    }
}
