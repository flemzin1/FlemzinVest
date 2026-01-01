
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    CreditCard,
    Settings,
    PanelLeft,
    User,
    Headset,
    Bell,
    Hourglass,
    Landmark,
    TrendingUp,
    Wrench,
    Mail,
    Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const desktopNavItems = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/pending-transactions", label: "Pending Transactions" },
    { href: "/admin/finance", label: "Finance" },
    { href: "/admin/mail", label: "Mail" },
    { href: "/admin/site-maintenance", label: "General Settings" },
];

const mobileMenuItems = [
    { href: "/admin/pending-transactions", icon: Hourglass, label: "Pending" },
    { href: "/admin/finance", icon: Wallet, label: "Finance" },
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/mail", icon: Mail, label: "Mail" },
    { href: "/admin/site-maintenance", icon: Settings, label: "Settings" },
];

function AdminHeader({ isAuthenticated }: { isAuthenticated: boolean }) {
    const pathname = usePathname();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [hasUnread, setHasUnread] = useState(true);
    useEffect(() => setMounted(true), []);

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userEmail');
        router.push('/login');
    };

    const checkActivePath = (href: string) => {
        if (!mounted) return false;
        return pathname.startsWith(href);
    }

    return (
        <header className="fixed top-0 z-40 flex h-16 w-full items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 sm:px-6">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
                <PanelLeft className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-semibold">Admin Panel</h1>
            </Link>

            {isAuthenticated && (
                 <nav className="hidden md:flex items-center gap-2 ml-10">
                    {desktopNavItems.map(item => {
                        const isActive = checkActivePath(item.href);
                        return (
                            <Link key={item.label} href={item.href} className={cn(
                                "text-sm font-medium transition-colors px-4 py-2 rounded-full",
                                isActive ? "bg-accent text-accent-foreground shadow-[0_0_10px_hsl(var(--accent))]" : "text-muted-foreground hover:text-primary"
                            )}>
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>
            )}

            <div className="flex items-center gap-2 ml-auto">
                {isAuthenticated && (
                    <>
                        <Button asChild variant="ghost" size="icon" className="">
                            <Link href="/admin/support">
                                <Headset className="h-5 w-5" />
                                <span className="sr-only">Support Chat</span>
                            </Link>
                        </Button>
                        <div className="relative">
                            <Button asChild variant="ghost" size="icon" className="">
                                <Link href="/admin/notifications">
                                    <Bell className="h-5 w-5" />
                                    <span className="sr-only">Notifications</span>
                                </Link>
                            </Button>
                            {hasUnread && (
                                <div className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-accent" />
                            )}
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary" size="icon" className="rounded-full">
                                    <User className="h-5 w-5" />
                                    <span className="sr-only">Toggle user menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </>
                )}
            </div>
        </header>
    );
}


function AdminMobileBottomNav() {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const checkActivePath = (href: string) => {
        if (!mounted) return false;
        if (href === "/admin/dashboard") return pathname === href;
        return pathname.startsWith(href);
    };

    return (
        <div className="fixed bottom-0 left-0 z-50 w-full h-24 bg-background border-t md:hidden">
            <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
                {mobileMenuItems.map((item) => {
                    const isActive = checkActivePath(item.href);

                    return (
                        <Link
                          href={item.href}
                          key={item.label}
                          className={cn(
                            "flex flex-col items-center justify-center pt-2 group"
                           )}
                        >
                          <div
                            className={cn(
                              "relative flex flex-col items-center justify-center transition-all duration-300 w-24 h-24 p-2",
                              isActive
                                ? "-translate-y-12 bg-accent text-accent-foreground rounded-full shadow-[0_-8px_20px_-5px_hsl(var(--accent)/0.5)]"
                                : "text-muted-foreground group-hover:text-foreground"
                            )}
                          >
                            <item.icon className="h-6 w-6 mb-1" />
                            <span className="text-xs text-center px-1">
                              {item.label}
                            </span>
                          </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

export function AdminAppShell({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);
    const [isMounted, setIsMounted] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
        const authStatus = localStorage.getItem('isAuthenticated') === 'true';
        const userEmail = localStorage.getItem('userEmail');
        
        if (!authStatus || userEmail?.toLowerCase() !== 'admin@gmail.com') {
            router.push('/login');
            setIsAuthenticated(false);
        } else {
            setIsAuthenticated(true);
        }
    }, [pathname, router]);
    
    if (!isMounted || isAuthenticated === undefined) {
       return (
         <div className="flex min-h-screen w-full flex-col bg-background">
           <header className="fixed top-0 z-40 flex h-16 w-full items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 sm:px-6">
              <Link href="/admin/dashboard" className="flex items-center gap-2">
                  <PanelLeft className="h-6 w-6 text-primary" />
                  <h1 className="text-xl font-semibold">Admin Panel</h1>
              </Link>
           </header>
           <main className="flex-1 pt-16 pb-24 md:pb-0">
             {/* Optional: Add a loading spinner */}
           </main>
           <div className="fixed bottom-0 left-0 z-50 w-full h-24 bg-background border-t md:hidden" />
         </div>
       );
    }
    
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <AdminHeader isAuthenticated={isAuthenticated} />
            <main className="flex-1 pt-16 pb-24 md:pb-0">
                {children}
            </main>
            {isAuthenticated && <AdminMobileBottomNav />}
        </div>
    );
}
