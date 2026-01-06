
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { investmentPlans } from "@/lib/data";
import { useUser } from "@/hooks/use-user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { notFound } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

export default function InvestmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const user = useUser();
  const { id } = params;

  const plan = investmentPlans.find((p) => p.id === id);

  const [amount, setAmount] = useState("");

  if (!plan) {
    return notFound();
  }

  const isButtonDisabled = user?.status !== 'Active';

  const handleConfirmInvestment = () => {
    if (!user || user.status !== 'Active') return;

    const investmentAmount = parseFloat(amount);
    if (isNaN(investmentAmount) || investmentAmount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a valid investment amount.",
      });
      return;
    }
    if (investmentAmount > user.availableBalance) {
      toast({
        variant: "destructive",
        title: "Insufficient Funds",
        description: `Your available balance is ${formatCurrency(user.availableBalance)}.`,
      });
      return;
    }

    toast({
      title: "Investment Successful!",
      description: `You have successfully invested ${formatCurrency(investmentAmount)} in ${plan.offerer}'s ${plan.type}.`,
    });
    router.push("/");
  };


  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
            <Link href="/invest">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Offers
            </Link>
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl text-primary">{plan.offerer}</CardTitle>
                <CardDescription className="text-lg font-semibold">{plan.type}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <p className="text-sm text-muted-foreground">Return on Investment</p>
                    <p className="text-2xl font-bold text-accent">{plan.roi}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Investment Range</p>
                    <p className="text-xl font-bold">{plan.range}</p>
                </div>
                 <div>
                    <p className="text-sm text-muted-foreground mb-2">Features</p>
                    <ul className="space-y-3">
                        {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-accent" />
                            <span>{feature}</span>
                        </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Place Your Investment</CardTitle>
                <CardDescription>Enter the amount you wish to invest.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-4 rounded-lg border bg-secondary/30">
                    <p className="text-sm text-muted-foreground">Available Balance</p>
                    <p className="text-2xl font-bold">{formatCurrency(user?.availableBalance ?? 0)}</p>
                </div>
                <div>
                    <Label htmlFor="amount" className="text-base">Investment Amount (USD)</Label>
                    <Input 
                        id="amount" 
                        type="number" 
                        placeholder="Enter amount" 
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)}
                        className="h-12 text-lg mt-2"
                        disabled={isButtonDisabled}
                    />
                </div>
            </CardContent>
            <CardFooter>
                 <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="w-full">
                                <Button
                                    onClick={handleConfirmInvestment}
                                    className="w-full h-12 text-lg"
                                    disabled={isButtonDisabled}
                                >
                                    Confirm Investment
                                </Button>
                            </div>
                        </TooltipTrigger>
                        {isButtonDisabled && (
                            <TooltipContent>
                                <p>Your account is not active. Please contact support.</p>
                            </TooltipContent>
                        )}
                    </Tooltip>
                 </TooltipProvider>
            </CardFooter>
        </Card>
      </div>
    </div>
  );
}
