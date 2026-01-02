
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

const publicPages = ['/', '/about', '/contact', '/faq', '/offers', '/legal', '/careers'];
const authPages = ['/login', '/signup'];


function AppShellContent({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isPublicPage, setIsPublicPage] = useState(true);
    const [isAuthPage, setIsAuthPage] = useState(false);
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
        const currentIsAuth = authPages.includes(pathname);
        setIsPublicPage(currentIsPublic);
        setIsAuthPage(currentIsAuth);

        const isAdminPage = pathname.startsWith('/admin');
        
        if (isAdminPage) {
            setIsMounted(true);
            return;
        };

        if (authStatus) {
            if (pathname === '/' || pathname === '/login' || pathname === '/signup') {
                if (isAdmin) {
                    router.push('/admin/dashboard');
                } else {
                    router.push('/dashboard');
                }
                return;
            }
        } else {
            if (!currentIsPublic && !currentIsAuth) {
                router.push('/login');
                return;
            }
        }
        setIsMounted(true);
    }, [pathname, router]);
    
    if (pathname.startsWith('/admin')) {
        return <>{children}</>;
    }
    
    // Render a single, consistent layout. Visibility is controlled by CSS.
    // This prevents hydration errors and layout shifts.
    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <div className="flex-1">
                <Header isAuthenticated={isAuthenticated} />
                <main className={cn("pt-16 md:pb-0", isMounted ? "pb-24" : "pb-0")}>
                    {isMounted && children}
                </main>
            </div>
            <MobileBottomNav className={cn({ 'hidden': !isMounted || isPublicPage || isAuthPage || !isAuthenticated })} />
            <Footer className={cn({ 'hidden': !isMounted || !isPublicPage || isAuthenticated })} />
        </div>
    );
}


export function AppShell({ children }: { children: React.ReactNode }) {
    return <AppShellContent>{children}</AppShellContent>;
}

function MobileBottomNav({ className }: { className?: string }) {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const checkActivePath = (href: string) => {
      if (!mounted) return false;
      if (href === "/dashboard") return pathname === href;
      return pathname.startsWith(href);
    }
    
    return (
        <div className={cn("fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t md:hidden", className)}>
            <div className="grid h-full grid-cols-5 mx-auto font-medium">
                {mobileMenuItems.map((item) => {
                    const isActive = checkActivePath(item.href);
                    return (
                        <Link
                          href={item.href}
                          key={item.label}
                          className="flex flex-col items-center justify-center group"
                        >
                          <div
                            className={cn(
                              "relative flex flex-col items-center transition-all duration-300",
                              isActive
                                ? "h-20 w-20 justify-center p-3 mx-auto -translate-y-8 bg-accent text-accent-foreground rounded-full shadow-[0_-8px_20px_-5px_hsl(var(--accent)/0.5)]"
                                : "text-muted-foreground group-hover:text-foreground h-16 w-16 justify-center"
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
