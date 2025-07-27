"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Building, Mail, Hash, Info } from "lucide-react";

interface UserType {
  firstName: string;
  lastName: string;
  email: string;
}

interface Profile {
  user: UserType;
  brandName: string;
  businessAddress: string;
  gstNumber?: string | null;
  bio?: string | null;
}

function ProfileDetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-4 py-4 border-b last:border-b-0">
      <div className="flex-shrink-0 text-muted-foreground mt-1">{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-semibold text-lg">{value}</p>
      </div>
    </div>
  );
}

export default function SellerProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch("/api/profiles");
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch profile.");
        }
        setProfile(data.profile);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center">
        <div className="container py-12 max-w-3xl">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-56" />
              <Skeleton className="h-4 w-72 mt-2" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container py-12 text-center text-red-500">
        {error || "Profile could not be loaded. Please ensure you have created one."}
      </div>
    );
  }

  return (
    <div className="w-full px-4 flex flex-col items-center">
      <div className="container py-12 max-w-3xl">
        <Card className="overflow-hidden">
          <CardHeader className="bg-muted/50">
            <CardTitle className="text-3xl">Seller Profile</CardTitle>
            <CardDescription>Your account and business details.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Account Information
              </h3>
              <div className="grid grid-cols-2">
                <ProfileDetailRow
                  icon={<User className="h-5 w-5" />}
                  label="Full Name"
                  value={`${profile.user.firstName} ${profile.user.lastName}`}
                />
                <ProfileDetailRow
                  icon={<Mail className="h-5 w-5" />}
                  label="Email Address"
                  value={profile.user.email}
                />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Business Information
              </h3>
              <div className="grid grid-cols-2">
                <ProfileDetailRow
                  icon={<Building className="h-5 w-5" />}
                  label="Brand Name"
                  value={profile.brandName}
                />
                <ProfileDetailRow
                  icon={<Building className="h-5 w-5" />}
                  label="Business Address"
                  value={profile.businessAddress}
                />
                <ProfileDetailRow
                  icon={<Hash className="h-5 w-5" />}
                  label="GST Number"
                  value={profile.gstNumber || "Not provided"}
                />
                <ProfileDetailRow
                  icon={<Info className="h-5 w-5" />}
                  label="About Your Business"
                  value={profile.bio || "Not provided"}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
