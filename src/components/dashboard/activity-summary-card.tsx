
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { pendingDeposits, pendingWithdrawals, activeInvestments } from "@/lib/data";
import { Activity } from "lucide-react";

const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

export function ActivitySummaryCard() {
  return (
    <Card className="shadow-md border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium text-muted-foreground">Activity Summary</CardTitle>
        <Activity className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
            <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Pending Deposit</p>
                <p className="text-base sm:text-2xl font-bold">{formatCurrency(pendingDeposits)}</p>
            </div>
            <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Pending Withdrawal</p>
                <p className="text-base sm:text-2xl font-bold">{formatCurrency(pendingWithdrawals)}</p>
            </div>
            <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Active Investments</p>
                <p className="text-base sm:text-2xl font-bold">{activeInvestments}</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
