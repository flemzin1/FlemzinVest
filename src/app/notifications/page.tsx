
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { notifications as initialNotifications, type Notification } from "@/lib/data";
import { cn } from "@/lib/utils";
import { CheckCheck, MailOpen } from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <Card>
        <CardHeader className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>You have {unreadCount} unread messages.</CardDescription>
          </div>
          <Button onClick={markAllAsRead} disabled={unreadCount === 0} className="w-full md:w-auto">
            <MailOpen className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Dialog key={notification.id}>
                <DialogTrigger asChild>
                  <div
                    className={cn(
                      "flex items-start gap-4 rounded-lg border p-4 text-left text-sm transition-all hover:bg-secondary/50 cursor-pointer",
                      !notification.read && "bg-secondary"
                    )}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                  >
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-8 w-8",
                        notification.read ? "text-muted-foreground cursor-default" : "text-primary hover:text-primary"
                      )}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent dialog from opening twice
                        if (!notification.read) {
                          markAsRead(notification.id);
                        }
                      }}
                      title="Mark as read"
                    >
                      <CheckCheck className="h-4 w-4" />
                    </Button>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{notification.title}</DialogTitle>
                    <DialogDescription className="pt-2">{notification.timestamp}</DialogDescription>
                  </DialogHeader>
                  <div className="py-4">{notification.message}</div>
                </DialogContent>
              </Dialog>
            ))}
            {notifications.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <p>You have no notifications.</p>
                </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
