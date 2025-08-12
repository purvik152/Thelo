/*
* =================================================================================================
* FILE: src/components/custom/SignupPageComponent.tsx
*
* This is the signup form, refactored into a reusable component.
* =================================================================================================
*/
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function FormMessage({ type, message }: { type: 'error' | 'success', message: string }) {
  if (!message) return null;
  const color = type === 'error' ? 'text-red-600' : 'text-green-600';
  return <p className={`text-sm font-medium ${color}`}>{message}</p>;
}

export function SignupPageComponent() {
  const router = useRouter();
  const [role, setRole] = useState("shopkeeper");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const firstName = formData.get("first-name") as string;
    const lastName = formData.get("last-name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password, role }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong");
      
      // After signup, automatically log the user in
      const loginResponse = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
      });
      const loginData = await loginResponse.json();
      if (!loginResponse.ok) throw new Error(loginData.message || "Auto-login failed.");

      if (role === "seller") {
        router.push("/dashboard/seller");
      } else {
        router.push("/dashboard/shopkeeper");
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
            Join Thelo
          </CardTitle>
          <CardDescription className="text-gray-600 text-base">
            Create your account and start trading today
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name" className="text-sm font-medium text-gray-700">First Name</Label>
                  <Input
                    id="first-name"
                    name="first-name"
                    placeholder="John"
                    className="bg-white border-gray-300 focus:border-[#BEA093] focus:ring-[#BEA093]/20 transition-all duration-300 h-11"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name" className="text-sm font-medium text-gray-700">Last Name</Label>
                  <Input
                    id="last-name"
                    name="last-name"
                    placeholder="Doe"
                    className="bg-white border-gray-300 focus:border-[#BEA093] focus:ring-[#BEA093]/20 transition-all duration-300 h-11"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  className="bg-white border-gray-300 focus:border-[#BEA093] focus:ring-[#BEA093]/20 transition-all duration-300 h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a strong password"
                  className="bg-white border-gray-300 focus:border-[#BEA093] focus:ring-[#BEA093]/20 transition-all duration-300 h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium text-gray-700">I am a...</Label>
                <Select onValueChange={setRole} defaultValue={role}>
                  <SelectTrigger className="bg-white border-gray-300 focus:border-[#BEA093] focus:ring-[#BEA093]/20 transition-all duration-300 h-11">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-xl">
                    <SelectItem value="shopkeeper" className="hover:bg-[#FBF3E5] cursor-pointer">
                      Shopkeeper - Buy products
                    </SelectItem>
                    <SelectItem value="seller" className="hover:bg-[#FBF3E5] cursor-pointer">
                      Seller - Sell products
                    </SelectItem>
                  </SelectContent>
                </Select>
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
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
