
'use client';

import Link from "next/link";
import { BarChart3, Bell, Headset, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const desktopNavItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/deposit", label: "Deposit" },
    { href: "/invest", label: "Invest" },
    { href: "/withdraw", label: "Withdraw" },
]

const unauthenticatedNavItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/offers", label: "Product Offers" },
    { href: "/contact", label: "Contact" },
    { href: "/faq", label: "FAQs" },
]

function DesktopNav({ isAuthenticated }: { isAuthenticated: boolean }) {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const checkActivePath = (href: string) => {
        if (!mounted) return false;
        if (href === "/dashboard") return pathname === href;
        if (href === "/") return pathname === href;
        return pathname.startsWith(href);
    }
    
    const navItems = isAuthenticated ? desktopNavItems : unauthenticatedNavItems;
    
    return (
        <nav className="hidden md:flex items-center gap-2 ml-10">
        {navItems.map(item => {
            const isActive = checkActivePath(item.href);
            const variantClass = isAuthenticated 
              ? (isActive ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:text-foreground")
              : (isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground");
            return (
                <Link key={item.label} href={item.href} className={cn(
                    "text-sm font-medium transition-colors px-4 py-2 rounded-full",
                    variantClass
                )}>
                    {item.label}
                </Link>
            )
        })}
      </nav>
    )
}

export function Header({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [hasUnread, setHasUnread] = useState(true);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    router.push('/');
  };
  
  if (!isMounted) {
    return (
      <header className="fixed top-0 z-40 flex h-16 w-full items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold">InvestView</h1>
        </Link>
      </header>
    );
  }
  
  const navItems = isAuthenticated ? desktopNavItems : unauthenticatedNavItems;

  return (
    <Collapsible
      asChild
      open={isMobileMenuOpen}
      onOpenChange={setIsMobileMenuOpen}
    >
      <div className="fixed top-0 w-full z-40">
        <header className="relative z-10 flex h-16 w-full items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 sm:px-6">
          <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2 mr-auto">
              <BarChart3 className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">InvestView</h1>
          </Link>
          
          <div className="hidden md:flex flex-1 justify-center">
             <DesktopNav isAuthenticated={isAuthenticated} />
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
                <>
                    <Button asChild variant="ghost" size="icon">
                        <Link href="/support">
                            <Headset className="h-5 w-5" />
                            <span className="sr-only">Support Chat</span>
                        </Link>
                    </Button>
                    <div className="relative">
                        <Button asChild variant="ghost" size="icon">
                            <Link href="/notifications">
                                <Bell className="h-5 w-5" />
                                <span className="sr-only">Notifications</span>
                            </Link>
                        </Button>
                        {hasUnread && (
                            <div className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
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
                        <DropdownMenuItem asChild><Link href="/profile">Profile</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild><Link href="/transactions">Transactions</Link></DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                </>
            ) : (
                <div className="flex items-center gap-2">
                    <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
                        <Link href="/login">Log In</Link>
                    </Button>
                    <Button asChild size="sm" className="hidden md:inline-flex">
                        <Link href="/signup">Sign Up</Link>
                    </Button>
                     <Button asChild variant="ghost" size="sm" className="md:hidden">
                        <Link href="/login">Log In</Link>
                    </Button>
                    <Button asChild size="sm" className="md:hidden">
                        <Link href="/signup">Sign Up</Link>
                    </Button>
                </div>
            )}
             {!isAuthenticated && (
                <CollapsibleTrigger asChild className="md:hidden">
                    <Button variant="outline" size="icon">
                        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </CollapsibleTrigger>
             )}
          </div>
        </header>
        {!isAuthenticated && (
            <CollapsibleContent className="md:hidden bg-background/95 backdrop-blur-sm border-b">
                <nav className="grid gap-1 p-4">
                {navItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className="p-3 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        {item.label}
                    </Link>
                ))}
                </nav>
            </CollapsibleContent>
        )}
      </div>
    </Collapsible>
  );
}
