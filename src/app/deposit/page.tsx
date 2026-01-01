
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Copy, ArrowLeft, Upload, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

const cryptoOptions = {
  BTC: {
    name: "Bitcoin",
    networks: {
      BTC: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    },
  },
  ETH: {
    name: "Ethereum",
    networks: {
      ERC20: "0x32Be343B94f860124dC4fEe278FDCBD38C102D88",
    },
  },
};

type CryptoCoin = keyof typeof cryptoOptions;
type CryptoNetwork<C extends CryptoCoin> = keyof (typeof cryptoOptions)[C]["networks"];

export default function DepositPage() {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [selectedCoin, setSelectedCoin] = useState<CryptoCoin>("BTC");
  const [selectedNetwork, setSelectedNetwork] = useState<CryptoNetwork<"BTC">>("BTC");
  const [txId, setTxId] = useState("");
  const [imageProof, setImageProof] = useState<File | null>(null);
  const { toast } = useToast();

  const handleCoinChange = (coin: CryptoCoin) => {
    setSelectedCoin(coin);
    const defaultNetwork = Object.keys(cryptoOptions[coin].networks)[0] as CryptoNetwork<typeof coin>;
    setSelectedNetwork(defaultNetwork as any);
  };
  
  const walletAddress = cryptoOptions[selectedCoin].networks[selectedNetwork as keyof typeof cryptoOptions[CryptoCoin]['networks']];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    toast({
      title: "Copied to clipboard!",
      description: "The wallet address has been copied.",
    });
  };
  
  const handleProceed = () => {
    if (parseFloat(amount) > 0) {
      setStep(2);
    } else {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a valid amount to deposit.",
      });
    }
  }

  const handleConfirm = () => {
    if (!txId && !imageProof) {
        toast({
            variant: "destructive",
            title: "Confirmation Required",
            description: "Please provide a Transaction ID or an image of your transaction.",
        });
        return;
    }
    toast({
      title: "Deposit Submitted",
      description: "Your deposit is being processed and will be credited to your account shortly.",
    });
    setStep(1);
    setAmount("");
    setTxId("");
    setImageProof(null);
  };

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Deposit</CardTitle>
          <CardDescription>Follow the steps to add funds to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="amount">Amount (USD)</Label>
                <Input id="amount" type="number" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>
              
              <div>
                <Label>Payment Method</Label>
                <RadioGroup defaultValue="crypto" className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="crypto" id="crypto" />
                    <Label htmlFor="crypto">Crypto</Label>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <RadioGroupItem value="card" id="card" disabled />
                    <Label htmlFor="card" className="flex items-center gap-2">Card <Badge variant="secondary">Coming Soon</Badge></Label>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <RadioGroupItem value="bank" id="bank" disabled />
                    <Label htmlFor="bank" className="flex items-center gap-2">Bank Transfer <Badge variant="secondary">Coming Soon</Badge></Label>
                  </div>
                   <div className="flex items-center space-x-2 text-muted-foreground">
                    <RadioGroupItem value="paypal" id="paypal" disabled />
                    <Label htmlFor="paypal" className="flex items-center gap-2">PayPal <Badge variant="secondary">Coming Soon</Badge></Label>
                  </div>
                </RadioGroup>
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
                      {Object.keys(cryptoOptions[selectedCoin].networks).map((network) => (
                        <SelectItem key={network} value={network}>{network}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg bg-secondary/50 space-y-4 text-center">
                <p className="text-sm text-muted-foreground">Send your funds to the address below.</p>
                <div className="flex justify-center">
                    <div className="p-2 bg-white rounded-lg">
                        <Image src={`https://api.qrserver.com/v1/create-qr-code/?size=128x128&data=${walletAddress}`} alt="QR Code" width={128} height={128} />
                    </div>
                </div>
                <div className="flex items-center gap-2 p-2 border rounded-md bg-background">
                  <p className="text-sm font-mono break-all">{walletAddress}</p>
                  <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button onClick={handleProceed} className="w-full">Proceed to Confirmation</Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
                <Button variant="outline" size="sm" onClick={() => setStep(1)} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
              <h3 className="font-semibold text-lg">Confirm Your Transaction</h3>
              <div>
                <Label htmlFor="txid">Transaction ID (TX ID)</Label>
                <Input id="txid" placeholder="Enter your transaction ID" value={txId} onChange={(e) => setTxId(e.target.value)} />
              </div>

              <div className="space-y-2">
                 <Label htmlFor="proof">Upload Image of Transaction</Label>
                 <div className="flex items-center justify-center w-full">
                    <label htmlFor="proof-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-secondary/50 hover:bg-secondary">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                            {imageProof ? (
                                <p className="text-sm text-foreground">{imageProof.name}</p>
                            ) : (
                                <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                            )}
                        </div>
                        <input id="proof-upload" type="file" className="hidden" accept="image/*" onChange={(e) => setImageProof(e.target.files ? e.target.files[0] : null)} />
                    </label>
                </div>
              </div>

              <Button onClick={handleConfirm} className="w-full">Confirm Deposit</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
