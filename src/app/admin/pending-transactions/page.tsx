
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { transactionHistory, type Transaction } from "@/lib/data";
import { PendingTransactionTable } from "@/components/admin/pending-transaction-table";

export default function PendingTransactionsPage() {
  const allPending = transactionHistory.filter(tx => tx.status === 'Pending');
  const pendingDeposits = transactionHistory.filter(tx => tx.type === 'Deposit' && tx.status === 'Pending');
  const pendingWithdrawals = transactionHistory.filter(tx => tx.type === 'Withdrawal' && tx.status === 'Pending');
  const pendingInvestments = transactionHistory.filter(tx => tx.type === 'Investment' && tx.status === 'Pending');

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Pending Transactions</CardTitle>
          <CardDescription>Review and approve pending deposits, withdrawals, and investments.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="grid h-auto w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="all">All ({allPending.length})</TabsTrigger>
              <TabsTrigger value="deposits">Deposits ({pendingDeposits.length})</TabsTrigger>
              <TabsTrigger value="withdrawals">Withdrawals ({pendingWithdrawals.length})</TabsTrigger>
              <TabsTrigger value="investments">Investments ({pendingInvestments.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <PendingTransactionTable transactions={allPending} />
            </TabsContent>
            <TabsContent value="deposits" className="mt-4">
              <PendingTransactionTable transactions={pendingDeposits} />
            </TabsContent>
            <TabsContent value="withdrawals" className="mt-4">
              <PendingTransactionTable transactions={pendingWithdrawals} />
            </TabsContent>
            <TabsContent value="investments" className="mt-4">
               <PendingTransactionTable transactions={pendingInvestments} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
