"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "seller" | "shopkeeper";
}

type FormMessageProps = {
  type: "error" | "success";
  message: string;
};

function FormMessage({ type, message }: FormMessageProps) {
  if (!message) return null;
  const color = type === "error" ? "text-red-600" : "text-green-600";
  return <p className={`text-sm font-medium ${color}`}>{message}</p>;
}

export function SignupPageComponent() {
  const router = useRouter();
  const [role, setRole] = useState<SignupFormData["role"]>("shopkeeper");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const data: SignupFormData = {
      firstName: formData.get("first-name") as string,
      lastName: formData.get("last-name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      role,
    };

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const respJson = await response.json();
      if (!response.ok) throw new Error(respJson.message || "Signup failed");

      const loginResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
      const loginResp = await loginResponse.json();
      if (!loginResponse.ok) throw new Error(loginResp.message || "Auto-login failed");

      router.push(role === "seller" ? "/dashboard/seller" : "/dashboard/shopkeeper");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-xl">Create an Account</CardTitle>
        <CardDescription>Enter your information to get started.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup}>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">First name</Label>
                <Input id="first-name" name="first-name" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input id="last-name" name="last-name" required />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">I am a...</Label>
              <Select
                value={role}
                onValueChange={(val) => setRole(val as SignupFormData["role"])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shopkeeper">Shopkeeper</SelectItem>
                  <SelectItem value="seller">Seller</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {error && <FormMessage type="error" message={error} />}
            <Button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="w-full bg-[#BEA093] hover:bg-[#FBF3E5] hover:text-[#BEA093]"
            >
              {loading ? "Creating Account..." : "Create an account"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
