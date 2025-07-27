import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import SellerProfile from '@/models/SellerProfile';
import ShopkeeperProfile from '@/models/ShopkeeperProfile';
import User from '@/models/User';

interface DecodedToken { id: string; role: string; }

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) return NextResponse.json({ message: 'No token' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    if (!decoded) return NextResponse.json({ message: 'Invalid token' }, { status: 401 });

    const { id: userId, role } = decoded;
    let profile;

    if (role === 'seller') {
      profile = await SellerProfile.findOne({ user: userId }).populate('user', 'firstName lastName email');
    } else if (role === 'shopkeeper') {
      profile = await ShopkeeperProfile.findOne({ user: userId }).populate('user', 'firstName lastName email');
    } else {
      return NextResponse.json({ message: 'Invalid role' }, { status: 400 });
    }

    if (!profile) return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
    return NextResponse.json({ success: true, profile });
  } catch (err) {
    console.error('PROFILE_FETCH_ERROR', err instanceof Error ? err.message : err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) return NextResponse.json({ message: 'No token' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    const { id: userId, role } = decoded;

    const body = await request.json();

    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ message: 'User missing' }, { status: 404 });

    if (role === 'seller') {
      const { brandName, businessAddress, gstNumber } = body;
      if (await SellerProfile.findOne({ user: userId })) {
        return NextResponse.json({ message: 'Profile exists' }, { status: 409 });
      }

      const profile = await new SellerProfile({ user: userId, brandName, businessAddress, gstNumber }).save();
      return NextResponse.json({ success: true, profile }, { status: 201 });
    }

    if (role === 'shopkeeper') {
      const { shopName, shopAddress, contactNumber } = body;
      if (await ShopkeeperProfile.findOne({ user: userId })) {
        return NextResponse.json({ message: 'Profile exists' }, { status: 409 });
      }

      const profile = await new ShopkeeperProfile({ user: userId, shopName, shopAddress, contactNumber }).save();
      return NextResponse.json({ success: true, profile }, { status: 201 });
    }

    return NextResponse.json({ message: 'Invalid role' }, { status: 400 });
  } catch (err) {
    console.error('PROFILE_CREATION_ERROR', err instanceof Error ? err.message : err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
