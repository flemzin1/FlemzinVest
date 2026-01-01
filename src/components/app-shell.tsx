
"use client";

import { Header } from "@/components/header";
import {
    Home,
    Landmark,
    Banknote,
    TrendingUp,
    User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { users } from "@/lib/data";
import { Footer } from "./footer";

const mobileMenuItems = [
    { href: "/deposit", icon: Landmark, label: "Deposit" },
    { href: "/invest", icon: TrendingUp, label: "Invest" },
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/withdraw", icon: Banknote, label: "Withdraw" },
    { href: "/profile", icon: User, label: "Profile" },
];

const publicPages = ['/', '/login', '/signup', '/about', '/contact', '/faq', '/offers', '/legal', '/careers'];

function AppShellContent({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isPublicPage, setIsPublicPage] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const authStatus = localStorage.getItem('isAuthenticated') === 'true';
        const userEmail = localStorage.getItem('userEmail');
        const isAdmin = userEmail?.toLowerCase() === 'admin@gmail.com';
        
        const currentUser = users.find(u => u.email === userEmail);
        const isBanned = currentUser ? localStorage.getItem(`banned_${currentUser.id}`) === 'true' : false;

        if (authStatus && isBanned) {
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('userEmail');
            router.push('/login');
            return;
        }

        setIsAuthenticated(authStatus);

        const currentIsPublic = publicPages.includes(pathname);
        setIsPublicPage(currentIsPublic);

        const isAdminPage = pathname.startsWith('/admin');
        
        if (isAdminPage) return;

        if (authStatus) {
            if (pathname === '/' || pathname === '/login' || pathname === '/signup') {
                if (isAdmin) {
                    router.push('/admin/dashboard');
                } else {
                    router.push('/dashboard');
                }
            }
        } else {
            if (!currentIsPublic) {
                router.push('/login');
            }
        }
        setIsMounted(true);
    }, [pathname, router]);
    
    if (pathname.startsWith('/admin')) {
        return <>{children}</>;
    }

    if (!isMounted) {
        // Render a skeleton layout that is consistent on server and client
        return (
            <div className="flex min-h-screen w-full flex-col bg-background">
                <Header isAuthenticated={false} />
                <main className="flex-1 pt-16 pb-24 md:pb-0" />
                {/* 
                  Include a placeholder for the bottom nav on initial load 
                  if the path is NOT a public page to prevent layout shifts.
                */}
                {!publicPages.includes(pathname) && (
                    <div className="fixed bottom-0 left-0 z-50 w-full h-24 bg-background border-t md:hidden" />
                )}
            </div>
        );
    }
    
    const shouldShowMobileNav = isAuthenticated && !isPublicPage;

    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <div className="flex-1">
                <Header isAuthenticated={isAuthenticated} />
                <main className="pt-16 pb-24 md:pb-0">
                    {children}
                </main>
            </div>
            {shouldShowMobileNav && <MobileBottomNav />}
            {isPublicPage && <Footer />}
        </div>
    );
}


export function AppShell({ children }: { children: React.ReactNode }) {
    return <AppShellContent>{children}</AppShellContent>;
}

function MobileBottomNav() {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const checkActivePath = (href: string) => {
      if (!mounted) return false;
      if (href === "/dashboard") return pathname === href;
      return pathname.startsWith(href);
    }
    
    return (
        <div className="fixed bottom-0 left-0 z-50 w-full h-24 bg-background border-t md:hidden">
            <div className="grid h-full grid-cols-5 mx-auto font-medium">
                {mobileMenuItems.map((item) => {
                    const isActive = checkActivePath(item.href);
                    return (
                        <Link
                          href={item.href}
                          key={item.label}
                          className="flex flex-col items-center justify-center pt-2 group"
                        >
                          <div
                            className={cn(
                              "relative flex flex-col items-center justify-center transition-all duration-300 p-2",
                              isActive
                                ? "h-24 w-24 -translate-y-12 bg-accent text-accent-foreground rounded-full shadow-[0_-8px_20px_-5px_hsl(var(--accent)/0.5)]"
                                : "text-muted-foreground group-hover:text-foreground h-20 w-20"
                            )}
                          >
                            <item.icon className="h-6 w-6 mb-1" />
                            <span className="text-xs text-center px-1">
                              {item.label}
                            </span>
                          </div>
                        </Link>
                    )
                })}
            </div>
      </div>
    )
}
