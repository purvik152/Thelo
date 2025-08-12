"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Bell } from 'lucide-react';

interface NotificationType {
    _id: string;
    message: string;
    link: string;
    isRead: boolean;
}

// 1. Add a 'role' prop to the component
export function NotificationBell({ role }: { role: 'seller' | 'shopkeeper' }) {
    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    const [hasError, setHasError] = useState(false);
    const router = useRouter();

    useEffect(() => {
        let isSubscribed = true;
        let retryCount = 0;
        const maxRetries = 3;

        const fetchNotifications = async () => {
            try {
                const abortController = new AbortController();
                const timeoutId = setTimeout(() => abortController.abort(), 5000);

                const response = await fetch('/api/notifications', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    cache: 'no-store',
                    signal: abortController.signal
                });

                clearTimeout(timeoutId);

                const data = await response.json();

                if (!response.ok) {
                    console.error(`Notifications API error: ${response.status}`, data);
                    if (response.status === 401) {
                        console.log('Authentication failed, user might need to re-login');
                        setHasError(true);
                        return;
                    }
                    if (response.status >= 500 && retryCount < maxRetries) {
                        retryCount++;
                        console.log(`Retrying notifications fetch (attempt ${retryCount}/${maxRetries})`);
                        setTimeout(fetchNotifications, 2000 * retryCount); // Exponential backoff
                        return;
                    }
                    setHasError(true);
                    return;
                }

                if (data.success && isSubscribed) {
                    setNotifications(data.notifications || []);
                    setHasError(false);
                    retryCount = 0; // Reset retry count on success
                } else if (!data.success) {
                    console.error('Notifications fetch failed:', data.message);
                    setHasError(true);
                }
            } catch (error: any) {
                if (error.name === 'AbortError') {
                    console.log('Notification fetch aborted');
                    return;
                }
                console.error("Failed to fetch notifications:", error);
                if (retryCount < maxRetries) {
                    retryCount++;
                    setTimeout(fetchNotifications, 2000 * retryCount);
                } else {
                    setHasError(true);
                }
            }
        };

        fetchNotifications();
        // Only set up interval if there's no error
        const intervalId = !hasError ? setInterval(fetchNotifications, 15000) : null;

        return () => {
            isSubscribed = false;
            if (intervalId) clearInterval(intervalId);
        };
    }, [hasError]);
    
    // 2. Filter notifications based on the role
    const filteredNotifications = notifications.filter(n => {
        const message = n.message.toLowerCase();
        if (role === 'seller') {
            // Sellers only see "new order" notifications
            return message.includes('new order');
        }
        if (role === 'shopkeeper') {
            // Shopkeepers only see status updates
            return message.includes('shipped') || message.includes('delivered') || message.includes('pending');
        }
        return false;
    });

    const unreadCount = filteredNotifications.filter(n => !n.isRead).length;

    const handleOpenChange = async (isOpen: boolean) => {
        if (isOpen && unreadCount > 0) {
            try {
                const response = await fetch('/api/notifications/read', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    cache: 'no-store'
                });

                if (response.ok) {
                    setNotifications(current => current.map(n => ({ ...n, isRead: true })));
                }
            } catch (error) {
                console.error("Failed to mark notifications as read:", error);
            }
        }
    };

    return (
        <DropdownMenu onOpenChange={handleOpenChange}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative bg-[#BEA093] text-white hover:bg-[#FBF3E5] hover:text-[#BEA093] ">
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                            {unreadCount}
                        </span>
                    )}
                    <Bell className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 md:w-96 bg-[#FBF3E5]">
                <DropdownMenuLabel className="bg-[#BEA093] rounded-t-lg">
                    {role === 'seller' ? 'New Orders' : 'Order Updates'}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {filteredNotifications.length > 0 ? (
                    <div className="max-h-80 overflow-y-auto">
                        {/* 3. Map over the new filtered list */}
                        {filteredNotifications.map(notif => (
                            <DropdownMenuItem key={notif._id} onSelect={() => router.push(notif.link)} className="flex items-start gap-3 p-2">
                                {!notif.isRead && (<span className="mt-1 flex h-2 w-2 rounded-full bg-sky-500" />)}
                                <p className={`whitespace-normal text-sm ${notif.isRead ? 'text-muted-foreground' : 'font-medium'}`}>
                                    {notif.message}
                                </p>
                            </DropdownMenuItem>
                        ))}
                    </div>
                ) : (
                    <p className="p-4 text-sm text-muted-foreground text-center">You have no new notifications.</p>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
