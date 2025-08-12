/*
* =================================================================================================
* FILE: src/components/custom/LoginPageComponent.tsx
*
* This is the login form, refactored into a reusable component.
* =================================================================================================
*/
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function FormMessage({ type, message }: { type: 'error' | 'success', message: string }) {
  if (!message) return null;
  const color = type === 'error' ? 'text-red-600' : 'text-green-600';
  return <p className={`text-sm font-medium ${color}`}>{message}</p>;
}

export function LoginPageComponent() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed.");
      
      if (data.user.role === 'seller') {
        router.push('/dashboard/seller');
      } else {
        router.push('/dashboard/shopkeeper');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="border-0 shadow-none bg-gradient-to-br from-white to-[#FDFBF4]">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[#BEA093] to-[#D4C4B0] bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-600 text-base">
            Enter your credentials to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white border-gray-300 focus:border-[#BEA093] focus:ring-[#BEA093]/20 transition-all duration-300 h-12"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className="bg-white border-gray-300 focus:border-[#BEA093] focus:ring-[#BEA093]/20 transition-all duration-300 h-12"
                  required
                />
              </div>
            </div>
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <FormMessage type="error" message={error} />
              </div>
            )}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-[#BEA093] to-[#D4C4B0] hover:from-[#D4C4B0] hover:to-[#BEA093] text-white font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
