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

interface LoginFormData {
  email: string;
  password: string;
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

export function LoginPageComponent() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const data: LoginFormData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const respJson = await response.json();
      if (!response.ok) throw new Error(respJson.message || "Login failed");

      if (respJson.user.role === "seller") router.push("/dashboard/seller");
      else router.push("/dashboard/shopkeeper");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email to access your dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            {error && <FormMessage type="error" message={error} />}
            <Button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="w-full bg-[#BEA093] hover:bg-[#FBF3E5] hover:text-[#BEA093]"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
