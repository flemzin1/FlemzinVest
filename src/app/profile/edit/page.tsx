
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userProfile } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EditProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [name, setName] = useState(userProfile.name);
  const [username, setUsername] = useState(userProfile.username);

  const handleSaveChanges = () => {
    // Here you would typically handle the API call to update the profile
    toast({
      title: "Profile Updated",
      description: "Your changes have been saved successfully.",
    });
    router.push("/profile");
  };

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
        <div className="mb-6">
            <Button asChild variant="outline" size="sm">
                <Link href="/profile">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Profile
                </Link>
            </Button>
        </div>
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" value={userProfile.email} disabled />
                     <p className="text-xs text-muted-foreground">
                        Your email address cannot be changed.
                    </p>
                </div>
            </CardContent>
            <CardFooter className="gap-4">
                <Button variant="outline" asChild>
                    <Link href="/profile">Cancel</Link>
                </Button>
                <Button onClick={handleSaveChanges}>Save Changes</Button>
            </CardFooter>
        </Card>
    </div>
  );
}
