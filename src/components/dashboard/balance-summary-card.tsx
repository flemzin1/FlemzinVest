
"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Wallet, ChevronDown } from "lucide-react";
import { totalBalance, availableBalance } from "@/lib/data";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

export function BalanceSummaryCard({ showAddMoneyButton = true }: { showAddMoneyButton?: boolean }) {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Card className="shadow-md border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium text-muted-foreground">Balance Summary</CardTitle>
        <Wallet className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-start justify-between mt-4">
          <Collapsible>
            <div className="flex items-center gap-4">
                <CollapsibleTrigger asChild>
                    <div className="flex items-center gap-2 cursor-pointer group">
                        <div>
                            <p className="text-sm text-muted-foreground">Available Balance</p>
                            <p className="text-2xl font-bold">{isVisible ? formatCurrency(availableBalance) : '****.**'}</p>
                        </div>
                        <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                    </div>
                </CollapsibleTrigger>

                <Button variant="ghost" size="icon" onClick={toggleVisibility} className="self-end mb-1">
                    {isVisible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                    <span className="sr-only">{isVisible ? 'Hide balances' : 'Show balances'}</span>
                </Button>
            </div>
            <CollapsibleContent className="pt-4">
                <div className="pl-1">
                    <p className="text-xs text-muted-foreground">Total Balance</p>
                    <p className="text-lg font-semibold">{isVisible ? formatCurrency(totalBalance) : '****.**'}</p>
                </div>
            </CollapsibleContent>
          </Collapsible>
          
          <div className="flex flex-col gap-2">
            <Button asChild variant="outline">
              <Link href="/transactions">Transaction History</Link>
            </Button>
            {showAddMoneyButton && (
                <Button asChild>
                    <Link href="/deposit">Add Money</Link>
                </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
