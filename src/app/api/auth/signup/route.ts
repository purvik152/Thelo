import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

interface SignupRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'seller' | 'shopkeeper';
}

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const body = (await request.json()) as SignupRequestBody;
    const { firstName, lastName, email, password, role } = body;

    if (!firstName || !lastName || !email || !password || !role) {
      return NextResponse.json(
        { message: 'All fields are required.' },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists.' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    return NextResponse.json(
      {
        message: 'User created successfully!',
        user: {
          id: newUser._id.toString(),
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('SIGNUP_ERROR', error);
    return NextResponse.json(
      { message: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
