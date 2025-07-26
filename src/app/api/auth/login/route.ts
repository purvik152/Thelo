import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { email, password } = await request.json();

    // 1. Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials. User not found.' }, { status: 401 });
    }

    // 2. **SECURITY: Compare the provided password with the stored hash**
    // bcrypt.compare will securely check if the plain text password matches the hash.
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json({ message: 'Invalid credentials. Incorrect password.' }, { status: 401 });
    }

    // 3. **SECURITY: Create a secure session token (JWT)**
    // This token contains the user's ID and role, and is signed with a secret key.
    const tokenPayload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, {
      expiresIn: '1d', // Token will expire in 1 day
    });

    // 4. Create a success response
    const response = NextResponse.json({
      message: 'Login successful!',
      success: true,
      user: {
          id: user._id,
          email: user.email,
          role: user.role
      }
    });

    // 5. **SECURITY: Set the token in an HTTP-Only cookie**
    // httpOnly: true makes the cookie inaccessible to client-side JavaScript,
    // preventing XSS attacks.
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      maxAge: 60 * 60 * 24 * 1, // 1 day
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('LOGIN_ERROR', error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}
