

"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { ArrowLeft, Edit, Save, PlusCircle, Globe } from "lucide-react";
import Link from "next/link";
import { users as allUsers, type User, type Transaction } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { cn } from "@/lib/utils";

const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

const getStatusVariant = (status: Transaction['status'] | User['status']) => {
  switch (status) {
    case 'Completed':
    case 'Profit':
    case 'Active':
      return 'secondary';
    case 'Pending':
      return 'default';
    case 'Failed':
    case 'Suspended':
      return 'destructive';
    default:
      return 'outline';
  }
};

export default function EditUserPage() {
  const params = useParams();
  const { toast } = useToast();
  const { userId } = params;

  const user = allUsers.find(u => u.id === userId);
  
  const [userTransactions, setUserTransactions] = useState<Transaction[]>([]);
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [isBalanceEditing, setIsBalanceEditing] = useState(false);
  
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [balance, setBalance] = useState(0);
  const [status, setStatus] = useState<User['status']>("Pending");
  
  const [isTxDialogOpen, setIsTxDialogOpen] = useState(false);
  const [isEditingTx, setIsEditingTx] = useState(false);
  const [currentTx, setCurrentTx] = useState<Transaction | Partial<Transaction> | null>(null);

  useEffect(() => {
    if (user) {
        setUserTransactions(user.transactions);
        setName(user.name);
        setUsername(user.username);
        setEmail(user.email);
        setBalance(user.totalBalance);
        setStatus(user.status);
    }
  }, [user]);


  if (!user) {
    return (
        <div className="flex-1 space-y-8 p-4 md:p-8">
            <Card>
                <CardHeader>
                    <CardTitle>User Not Found</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>The user with ID `{userId}` could not be found.</p>
                     <Button asChild variant="outline" className="mt-4">
                        <Link href="/admin/site-maintenance/users">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to User Management
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
  }

  const handleProfileSave = () => {
    toast({ title: "Profile Updated", description: "User's profile details have been saved." });
    setIsProfileEditing(false);
  };
  
  const handleBalanceSave = () => {
    toast({ title: "Balance Updated", description: "User's balance has been saved." });
    setIsBalanceEditing(false);
  };
  
  const handleStatusSave = () => {
    toast({ title: "Status Updated", description: `User has been set to ${status}.` });
  }

  const handleAddNewTx = () => {
    setIsEditingTx(false);
    setCurrentTx({
        id: `txn-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        type: 'Deposit',
        amount: 0,
        status: 'Pending',
        details: `For ${user.name}`
    });
    setIsTxDialogOpen(true);
  };

  const handleEditTx = (tx: Transaction) => {
    setIsEditingTx(true);
    setCurrentTx({ ...tx });
    setIsTxDialogOpen(true);
  };

  const handleSaveTx = () => {
    if (!currentTx || !currentTx.type || !currentTx.amount) {
        toast({
            variant: "destructive",
            title: "Invalid Transaction",
            description: "Please fill out all transaction fields."
        });
        return;
    }

    if (isEditingTx) {
        setUserTransactions(userTransactions.map(tx => tx.id === currentTx.id ? (currentTx as Transaction) : tx));
        toast({ title: "Transaction Updated", description: "The transaction has been successfully updated." });
    } else {
        setUserTransactions([currentTx as Transaction, ...userTransactions]);
        toast({ title: "Transaction Added", description: "The new transaction has been added to the user's history." });
    }

    setIsTxDialogOpen(false);
    setCurrentTx(null);
  };

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/site-maintenance/users">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to User Management
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">User Profile</CardTitle>
                    {!isProfileEditing && (
                        <Button variant="ghost" size="icon" onClick={() => setIsProfileEditing(true)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                    )}
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col items-center text-center space-y-3">
                        <Avatar className="h-24 w-24">
                            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        {isProfileEditing ? (
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                        ) : (
                            <p className="text-lg font-medium">{name}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        {isProfileEditing ? (
                             <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        ) : (
                            <p className="text-muted-foreground">{username}</p>
                        )}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                         {isProfileEditing ? (
                             <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        ) : (
                            <p className="text-muted-foreground">{email}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <p className="text-muted-foreground flex items-center gap-2"><Globe className="h-4 w-4" /> {user.country}</p>
                    </div>
                </CardContent>
                {isProfileEditing && (
                    <CardFooter className="gap-2 justify-end">
                        <Button variant="ghost" onClick={() => setIsProfileEditing(false)}>Cancel</Button>
                        <Button onClick={handleProfileSave}><Save className="mr-2 h-4 w-4" />Save</Button>
                    </CardFooter>
                )}
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Account Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <Select value={status} onValueChange={(value) => setStatus(value as User['status'])}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Suspended">Suspended</SelectItem>
                        </SelectContent>
                    </Select>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleStatusSave}>Save Status</Button>
                </CardFooter>
            </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Balance Management</CardTitle>
                     {!isBalanceEditing && (
                        <Button variant="ghost" size="icon" onClick={() => setIsBalanceEditing(true)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                    )}
                </CardHeader>
                <CardContent>
                    <Label htmlFor="balance">Total Balance (USD)</Label>
                    {isBalanceEditing ? (
                        <Input id="balance" type="number" value={balance} onChange={(e) => setBalance(parseFloat(e.target.value))} className="h-12 text-xl font-bold" />
                    ) : (
                        <p className="text-3xl font-bold">{formatCurrency(balance)}</p>
                    )}
                </CardContent>
                 {isBalanceEditing && (
                    <CardFooter className="gap-2 justify-end">
                        <Button variant="outline" onClick={() => setIsBalanceEditing(false)}>Cancel</Button>
                        <Button onClick={handleBalanceSave}>Save Balance</Button>
                    </CardFooter>
                )}
            </Card>
            <Card>
                <CardHeader className="flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between">
                    <div className="order-2 md:order-1">
                        <CardTitle>Transaction History</CardTitle>
                        <CardDescription>A log of the user&apos;s financial activities.</CardDescription>
                    </div>
                    <div className="order-1 flex w-full justify-end md:order-2 md:w-auto">
                        <Button variant="outline" size="sm" onClick={handleAddNewTx}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Transaction
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {userTransactions.length > 0 ? userTransactions.map((tx) => (
                                    <TableRow key={tx.id}>
                                        <TableCell className="font-medium">{tx.date}</TableCell>
                                        <TableCell>{tx.type}</TableCell>
                                        <TableCell className={cn(
                                            "text-right font-semibold",
                                            tx.type === 'Deposit' || tx.type === 'Profit' ? 'text-accent' : 
                                            tx.type === 'Withdrawal' ? 'text-destructive' : ''
                                        )}>
                                            {tx.type === 'Deposit' || tx.type === 'Profit' ? '+' : tx.type === 'Withdrawal' ? '-' : ''}{formatCurrency(tx.amount)}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={getStatusVariant(tx.status)}>{tx.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleEditTx(tx)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-24">No transactions found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>

       <Dialog open={isTxDialogOpen} onOpenChange={setIsTxDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{isEditingTx ? "Edit" : "Add"} Transaction</DialogTitle>
                <DialogDescription>
                    {isEditingTx ? "Update the details of this transaction." : "Add a new transaction to this user's history."}
                </DialogDescription>
            </DialogHeader>
            {currentTx && (
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tx-type" className="text-right">Type</Label>
                        <Select
                            value={currentTx.type}
                            onValueChange={(value) => setCurrentTx({ ...currentTx, type: value as Transaction['type'] })}
                        >
                            <SelectTrigger id="tx-type" className="col-span-3">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Deposit">Deposit</SelectItem>
                                <SelectItem value="Withdrawal">Withdrawal</SelectItem>
                                <SelectItem value="Investment">Investment</SelectItem>
                                <SelectItem value="Profit">Profit</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tx-amount" className="text-right">Amount</Label>
                        <Input
                            id="tx-amount"
                            type="number"
                            value={currentTx.amount}
                            onChange={(e) => setCurrentTx({ ...currentTx, amount: parseFloat(e.target.value) || 0 })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tx-details" className="text-right">Details</Label>
                        <Input
                            id="tx-details"
                            value={currentTx.details}
                            onChange={(e) => setCurrentTx({ ...currentTx, details: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tx-status" className="text-right">Status</Label>
                        <Select
                             value={currentTx.status}
                             onValueChange={(value) => setCurrentTx({ ...currentTx, status: value as Transaction['status'] })}
                        >
                            <SelectTrigger id="tx-status" className="col-span-3">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Completed">Completed</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Failed">Failed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleSaveTx}>Save Transaction</Button>
            </DialogFooter>
        </DialogContent>
       </Dialog>
    </div>
  );
}
