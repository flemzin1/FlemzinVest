
"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Bitcoin, Edit, ArrowLeft, Save, X, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const initialCryptoGateways = [
  {
    id: "btc1",
    coin: "Bitcoin",
    Icon: Bitcoin,
    network: "BTC (SegWit)",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    status: "Active"
  },
  {
    id: "eth1",
    coin: "Ethereum",
    Icon: () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" className="h-5 w-5"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"/></svg>,
    network: "ERC20",
    address: "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
    status: "Active"
  },
];


export default function CryptoGatewayPage() {
  const [gateways, setGateways] = useState(initialCryptoGateways);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingAddress, setEditingAddress] = useState("");
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  // State for the 'Add New' dialog
  const [newCoin, setNewCoin] = useState("");
  const [newNetwork, setNewNetwork] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);


  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingId]);

  const handleEdit = (gateway: typeof initialCryptoGateways[0]) => {
    setEditingId(gateway.id);
    setEditingAddress(gateway.address);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingAddress("");
  };

  const handleSave = (id: string) => {
    setGateways(gateways.map(g => 
      g.id === id ? { ...g, address: editingAddress } : g
    ));
    toast({
      title: "Address Updated",
      description: "The wallet address has been successfully updated.",
    });
    handleCancel();
  };
  
  const handleAddNewGateway = () => {
    if (!newCoin || !newNetwork || !newAddress) {
        toast({
            variant: 'destructive',
            title: 'Missing Information',
            description: 'Please fill out all fields to add a new wallet.',
        });
        return;
    }

    const newGateway = {
        id: `custom-${Date.now()}`,
        coin: newCoin,
        Icon: Bitcoin, // Using a default icon for simplicity
        network: newNetwork,
        address: newAddress,
        status: "Active" as "Active"
    };

    setGateways([...gateways, newGateway]);
    toast({
        title: 'Wallet Added',
        description: `${newCoin} wallet has been successfully added.`,
    });

    // Reset form and close dialog
    setNewCoin('');
    setNewNetwork('');
    setNewAddress('');
    setIsAddDialogOpen(false);
  };

  const handleRemove = (id: string) => {
    setGateways(gateways.filter(g => g.id !== id));
    toast({
      title: "Wallet Removed",
      description: "The wallet has been successfully removed.",
    });
  };

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
       <div className="mb-6">
        <Button asChild variant="outline" size="sm">
            <Link href="/admin/payment-gateways">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Payment Gateways
            </Link>
        </Button>
      </div>
      <Card>
        <CardHeader className="flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between">
          <div className="order-2 md:order-1">
            <CardTitle>Cryptocurrency Wallets</CardTitle>
            <CardDescription>Manage your crypto payment addresses.</CardDescription>
          </div>
          <div className="order-1 flex w-full justify-end md:order-2 md:w-auto">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" /> Add New Wallet
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Crypto Wallet</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new cryptocurrency wallet.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="coin-name" className="text-right">
                      Coin
                    </Label>
                    <Input id="coin-name" value={newCoin} onChange={(e) => setNewCoin(e.target.value)} placeholder="e.g. Litecoin" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="network-name" className="text-right">
                      Network
                    </Label>
                    <Input id="network-name" value={newNetwork} onChange={(e) => setNewNetwork(e.target.value)} placeholder="e.g. LTC" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="address" className="text-right">
                      Address
                    </Label>
                    <Input id="address" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} placeholder="Wallet address" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" onClick={handleAddNewGateway}>Save Wallet</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                {gateways.map((gateway) => (
                <div key={gateway.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                            <gateway.Icon />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <p className="font-semibold">{gateway.coin} <span className="text-sm text-muted-foreground">({gateway.network})</span></p>
                                <Badge variant={gateway.status === 'Active' ? 'secondary' : 'destructive'}>{gateway.status}</Badge>
                            </div>
                            {editingId === gateway.id ? (
                              <Input 
                                ref={editingId === gateway.id ? inputRef : null}
                                value={editingAddress} 
                                onChange={(e) => setEditingAddress(e.target.value)}
                                className="text-sm font-mono mt-1 h-8"
                              />
                            ) : (
                              <p className="text-sm font-mono text-muted-foreground break-all">{gateway.address}</p>
                            )}
                        </div>
                    </div>
                     <div className="flex items-center gap-2 ml-4">
                      {editingId === gateway.id ? (
                        <>
                          <Button variant="outline" size="icon" onClick={() => handleSave(gateway.id)}>
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={handleCancel}>
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                            <Button variant="outline" size="icon" onClick={() => handleEdit(gateway)}>
                                <Edit className="h-4 w-4" />
                            </Button>
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="icon">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently remove the wallet from your payment gateways.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleRemove(gateway.id)}>
                                            Continue
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </>
                      )}
                    </div>
                </div>
            ))}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
