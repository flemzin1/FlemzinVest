

"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/use-user";
import { type Transaction } from "@/lib/data";
import { cn } from "@/lib/utils";

const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

const getStatusVariant = (status: Transaction['status']) => {
  switch (status) {
    case 'Completed':
    case 'Profit':
      return 'secondary';
    case 'Pending':
      return 'default';
    case 'Failed':
      return 'destructive';
    default:
      return 'outline';
  }
};

function TransactionTable({ transactions }: { transactions: Transaction[] }) {
  if (transactions.length === 0) {
    return <p className="text-center text-muted-foreground mt-8">No transactions to display.</p>;
  }
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Details</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-center w-[100px]">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell className="font-medium">{tx.date}</TableCell>
              <TableCell>{tx.type}</TableCell>
              <TableCell className="text-muted-foreground">{tx.details}</TableCell>
              <TableCell className={cn(
                "text-right font-semibold",
                tx.type === 'Deposit' || tx.type === 'Profit' ? 'text-accent' : 
                tx.type === 'Withdrawal' ? 'text-destructive' : ''
              )}>
                {tx.type === 'Deposit' || tx.type === 'Profit' ? '+' : tx.type === 'Withdrawal' ? '-' : ''}{formatCurrency(tx.amount)}
              </TableCell>
              <TableCell className="text-center">
                <Badge variant={getStatusVariant(tx.status)} className="capitalize">
                  {tx.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function TransactionsPage() {
  const user = useUser();
  const userTransactions = user?.transactions || [];

  const deposits = userTransactions.filter(tx => tx.type === 'Deposit');
  const withdrawals = userTransactions.filter(tx => tx.type === 'Withdrawal');
  const investments = userTransactions.filter(tx => tx.type === 'Investment' || tx.type === 'Profit');

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>A record of your recent account activity.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="grid h-auto w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="deposits">Deposits</TabsTrigger>
              <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
              <TabsTrigger value="investments">Investments & Profits</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <TransactionTable transactions={userTransactions} />
            </TabsContent>
            <TabsContent value="deposits" className="mt-4">
              <TransactionTable transactions={deposits} />
            </TabsContent>
            <TabsContent value="withdrawals" className="mt-4">
              <TransactionTable transactions={withdrawals} />
            </TabsContent>
            <TabsContent value="investments" className="mt-4">
              <TransactionTable transactions={investments} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
