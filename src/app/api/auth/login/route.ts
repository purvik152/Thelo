import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

interface LoginBody {
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    if (!process.env.JWT_SECRET) {
      console.error("FATAL_ERROR: JWT_SECRET not set");
      throw new Error("Server configuration error.");
    }

    const { email, password } = (await request.json()) as LoginBody;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return NextResponse.json({ message: 'User not found.' }, { status: 401 });
    }

    if (!user.password) {
      return NextResponse.json({ message: 'Account misconfigured.' }, { status: 400 });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json({ message: 'Incorrect password.' }, { status: 401 });
    }

    const payload = { id: user._id.toString(), email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    const response = NextResponse.json({
      message: 'Login successful!',
      success: true,
      user: payload
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400,
      path: '/'
    });

    return response;
  } catch (err) {
    console.error('LOGIN_ERROR', err instanceof Error ? err.message : err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
