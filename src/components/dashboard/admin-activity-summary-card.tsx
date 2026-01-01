import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { newUsers, newInvestments, totalCapital, totalPayout } from "@/lib/data";
import { BarChart2 } from "lucide-react";

const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
const formatNumber = (value: number) => new Intl.NumberFormat('en-US').format(value);

export function AdminActivitySummaryCard() {
  return (
    <Card className="shadow-md border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium text-muted-foreground">Platform Growth</CardTitle>
        <BarChart2 className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
                <p className="text-sm text-muted-foreground">New Users</p>
                <p className="text-2xl font-bold">{formatNumber(newUsers)}</p>
            </div>
            <div>
                <p className="text-sm text-muted-foreground">New Investments</p>
                <p className="text-2xl font-bold">{formatNumber(newInvestments)}</p>
            </div>
            <div>
                <p className="text-sm text-muted-foreground">Total Capital</p>
                <p className="text-2xl font-bold">{formatCurrency(totalCapital)}</p>
            </div>
             <div>
                <p className="text-sm text-muted-foreground">Total Payout</p>
                <p className="text-2xl font-bold">{formatCurrency(totalPayout)}</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
