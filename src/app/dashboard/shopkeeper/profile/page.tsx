/*
* =================================================================================================
* FILE: src/app/dashboard/shopkeeper/profile/page.tsx
*
* ACTION: Create this new file and folder.
* This page provides a professional, detailed, and read-only view of the
* currently logged-in shopkeeper's profile.
* =================================================================================================
*/
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Store, Mail, Phone, Calendar } from 'lucide-react';

// A reusable component to display a piece of profile information
function ProfileDetailRow({ icon, label, value }: { icon: React.ReactNode, label: string, value?: string }) {
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

export default function ShopkeeperProfilePage() {
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchProfile() {
            try {
                const response = await fetch('/api/profiles');
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || "Failed to fetch profile.");
                }
                setProfile(data.profile);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
        fetchProfile();
    }, []);

    if (isLoading) {
        return (
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
        );
    }

    if (error || !profile) {
        return <div className="container py-12 text-center text-red-500">{error || "Profile could not be loaded. Please ensure you have created one."}</div>;
    }

    return (
        <div className="container py-12 max-w-3xl">
            <Card className="overflow-hidden">
                <CardHeader className="bg-muted/50">
                    <CardTitle className="text-3xl">Shopkeeper Profile</CardTitle>
                    <CardDescription>Your account and shop details.</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                     <div className="mb-6">
                        <h3 className="text-lg font-medium text-muted-foreground mb-2">Account Information</h3>
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
                </CardContent>
            </Card>
        </div>
    );
}
