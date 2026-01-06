
'use client';

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from 'react';
import { users } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [investorCode, setInvestorCode] = useState('');

  const handleLogin = () => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.investorCode === investorCode);

    if (user) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(user));

      if (user.email.toLowerCase() === 'admin@gmail.com') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Invalid email or investor code.',
      });
    }
  };


  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email and investor code to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="investor-code">Investor Code</Label>
            <Input id="investor-code" type="password" required value={investorCode} onChange={(e) => setInvestorCode(e.target.value)} />
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-4">
          <Button className="w-full" onClick={handleLogin}>Sign in</Button>
          <div className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline text-primary">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
