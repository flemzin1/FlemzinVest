
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const cryptoOptions = {
  BTC: {
    name: "Bitcoin",
    networks: ["BTC", "Lightning"],
  },
  ETH: {
    name: "Ethereum",
    networks: ["ERC20", "Arbitrum"],
  },
};

type CryptoCoin = keyof typeof cryptoOptions;
type CryptoNetwork<C extends CryptoCoin> = (typeof cryptoOptions)[C]["networks"][number];

export default function WithdrawPage() {
  const [amount, setAmount] = useState("");
  const [selectedCoin, setSelectedCoin] = useState<CryptoCoin>("BTC");
  const [selectedNetwork, setSelectedNetwork] = useState<CryptoNetwork<"BTC">>("BTC");
  const [walletAddress, setWalletAddress] = useState("");
  const { toast } = useToast();

  const handleCoinChange = (coin: CryptoCoin) => {
    setSelectedCoin(coin);
    const defaultNetwork = cryptoOptions[coin].networks[0];
    setSelectedNetwork(defaultNetwork as any);
  };

  const handleWithdraw = () => {
    if (parseFloat(amount) <= 0 || !walletAddress) {
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: "Please enter a valid amount and wallet address.",
      });
      return;
    }
    toast({
      title: "Withdrawal Submitted",
      description: `Your request to withdraw ${amount} USD of ${selectedCoin} has been submitted.`,
    });
    setAmount("");
    setWalletAddress("");
  };

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Withdraw</CardTitle>
          <CardDescription>Withdraw funds to your external crypto wallet.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Label htmlFor="amount">Amount (USD)</Label>
              <Input id="amount" type="number" placeholder="Enter amount to withdraw" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="coin">Select Coin</Label>
                <Select value={selectedCoin} onValueChange={(value: CryptoCoin) => handleCoinChange(value)}>
                  <SelectTrigger id="coin">
                    <SelectValue placeholder="Select coin" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(cryptoOptions).map((coin) => (
                      <SelectItem key={coin} value={coin}>{cryptoOptions[coin as CryptoCoin].name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="network">Select Network</Label>
                <Select value={selectedNetwork} onValueChange={(value: any) => setSelectedNetwork(value)}>
                  <SelectTrigger id="network">
                    <SelectValue placeholder="Select network" />
                  </SelectTrigger>
                  <SelectContent>
                    {cryptoOptions[selectedCoin].networks.map((network) => (
                      <SelectItem key={network} value={network}>{network}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="address">Wallet Address</Label>
              <Input id="address" placeholder={`Enter your ${selectedNetwork} wallet address`} value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} />
            </div>

            <Button onClick={handleWithdraw} className="w-full">Withdraw Funds</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
