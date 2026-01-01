
"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { transactionHistory, type Transaction } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

const getStatusVariant = (status: Transaction['status']) => {
  switch (status) {
    case 'Completed': return 'secondary';
    case 'Pending': return 'default';
    case 'Failed': return 'destructive';
    default: return 'outline';
  }
};

export function PendingTransactionTable({ transactions: initialTransactions }: { transactions: Transaction[] }) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleAction = (action: 'confirm' | 'reject') => {
    if (!selectedTransaction) return;

    // In a real app, you'd make an API call here.
    // For this mock, we just update the local state.
    setTransactions(transactions.filter(tx => tx.id !== selectedTransaction.id));
    
    toast({
      title: `Transaction ${action === 'confirm' ? 'Confirmed' : 'Rejected'}`,
      description: `Transaction ID ${selectedTransaction.id} has been processed.`,
    });
    
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  if (transactions.length === 0) {
    return <p className="text-center text-muted-foreground mt-8">No pending transactions to display.</p>;
  }

  return (
    <>
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
              <TableRow key={tx.id} onClick={() => handleRowClick(tx)} className="cursor-pointer">
                <TableCell className="font-medium">{tx.date}</TableCell>
                <TableCell>{tx.type}</TableCell>
                <TableCell className="text-muted-foreground">{tx.details}</TableCell>
                <TableCell className={cn(
                  "text-right font-semibold",
                  tx.type === 'Deposit' ? 'text-accent' : 
                  tx.type === 'Withdrawal' ? 'text-destructive' : ''
                )}>
                  {tx.type === 'Deposit' ? '+' : tx.type === 'Withdrawal' ? '-' : ''}{formatCurrency(tx.amount)}
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>Review the transaction and confirm or reject it.</DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="py-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Transaction ID:</span>
                <span className="font-mono text-sm">{selectedTransaction.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Date:</span>
                <span>{selectedTransaction.date}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Type:</span>
                <span>{selectedTransaction.type}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-bold text-lg">{formatCurrency(selectedTransaction.amount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Details:</span>
                <span>{selectedTransaction.details}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant={getStatusVariant(selectedTransaction.status)}>{selectedTransaction.status}</Badge>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => handleAction('reject')}>Reject</Button>
            <Button onClick={() => handleAction('confirm')}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
