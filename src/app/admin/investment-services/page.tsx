
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2 } from "lucide-react";
import { investmentPlans as initialInvestmentPlans, type InvestmentPlan } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

export default function InvestmentServicesPage() {
  const [plans, setPlans] = useState<InvestmentPlan[]>(initialInvestmentPlans);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<InvestmentPlan | null>(null);
  const { toast } = useToast();

  const handleAddNew = () => {
    setCurrentPlan({ id: `new-${Date.now()}`, offerer: "", type: "", roi: "", range: "", features: [] });
    setIsEditDialogOpen(true);
    setIsAddDialogOpen(true);
  };

  const handleEdit = (plan: InvestmentPlan) => {
    setCurrentPlan({ ...plan, features: plan.features || [] });
    setIsEditDialogOpen(true);
    setIsAddDialogOpen(false);
  };
  
  const handleDelete = (id: string) => {
    setPlans(plans.filter(p => p.id !== id));
    toast({
        title: "Offer Deleted",
        description: "The investment offer has been removed.",
    });
  };

  const handleSave = () => {
    if (!currentPlan) return;

    const { id, offerer, type, roi, range } = currentPlan;
    if (!offerer || !type || !roi || !range) {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please fill out all required fields.",
        });
        return;
    }
    
    if (isAddDialogOpen) {
      setPlans([...plans, currentPlan]);
      toast({
          title: "Offer Added",
          description: "The new investment offer has been created.",
      });
    } else {
      setPlans(plans.map(p => (p.id === id ? currentPlan : p)));
       toast({
          title: "Offer Updated",
          description: "The investment offer has been successfully updated.",
      });
    }

    setIsEditDialogOpen(false);
    setCurrentPlan(null);
  };

  const handleFeatureChange = (featuresString: string) => {
    if (currentPlan) {
        setCurrentPlan({ ...currentPlan, features: featuresString.split('\n') });
    }
  }

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Investment Services</CardTitle>
            <CardDescription>Configure investment plans and offerings.</CardDescription>
          </div>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" /> Add New Offer
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
            {plans.map((plan) => (
                <div key={plan.id} className="flex items-start justify-between rounded-lg border p-4">
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-primary">{plan.offerer}</p>
                        <p className="font-medium">{plan.type}</p>
                        <p className="text-sm text-muted-foreground mt-1">ROI: <span className="font-semibold text-accent">{plan.roi}</span> | Range: <span className="font-semibold">{plan.range}</span></p>
                        <ul className="list-disc list-inside text-xs text-muted-foreground mt-2">
                          {plan.features.map((feature, index) => (
                              <li key={index}>{feature}</li>
                          ))}
                        </ul>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                        <Button variant="outline" size="icon" onClick={() => handleEdit(plan)}>
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
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete this investment offer.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(plan.id)}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            ))}
            {plans.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <p>No investment offers configured.</p>
                </div>
            )}
        </CardContent>
      </Card>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{isAddDialogOpen ? 'Add New' : 'Edit'} Investment Offer</DialogTitle>
            <DialogDescription>
              {isAddDialogOpen ? 'Create a new investment plan for users.' : 'Update the details for this investment plan.'}
            </DialogDescription>
          </DialogHeader>
          {currentPlan && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="offerer" className="text-right">Offerer</Label>
                <Input id="offerer" value={currentPlan.offerer} onChange={(e) => setCurrentPlan({...currentPlan, offerer: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">Type</Label>
                <Input id="type" value={currentPlan.type} onChange={(e) => setCurrentPlan({...currentPlan, type: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="roi" className="text-right">ROI</Label>
                <Input id="roi" value={currentPlan.roi} onChange={(e) => setCurrentPlan({...currentPlan, roi: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="range" className="text-right">Range</Label>
                <Input id="range" value={currentPlan.range} onChange={(e) => setCurrentPlan({...currentPlan, range: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="features" className="text-right pt-2">Features</Label>
                <Textarea 
                    id="features" 
                    value={currentPlan.features.join('\n')} 
                    onChange={(e) => handleFeatureChange(e.target.value)}
                    className="col-span-3"
                    placeholder="Enter each feature on a new line."
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
