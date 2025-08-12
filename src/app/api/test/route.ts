import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Notification from '@/models/Notification';

export async function GET(request: NextRequest) {
    try {
        // Test database connection
        await dbConnect();
        
        // Test basic query
        const count = await Notification.countDocuments();
        
        return NextResponse.json({
            success: true,
            message: 'Database connection successful',
            notificationCount: count,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Test endpoint error:', error);
        return NextResponse.json({
            success: false,
            message: 'Database connection failed',
            error: String(error),
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}
