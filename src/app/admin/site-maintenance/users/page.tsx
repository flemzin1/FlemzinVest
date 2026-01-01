
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, UserPlus, Edit, Settings } from "lucide-react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { users, totalUsers, newlyRegisteredUsers, type User } from "@/lib/data";
import Image from "next/image";

const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

const getStatusVariant = (status: User['status']) => {
  switch (status) {
    case 'Active':
      return 'secondary';
    case 'Suspended':
      return 'destructive';
    case 'Pending':
      return 'default';
    default:
      return 'outline';
  }
};


export default function UserManagementPage() {
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
       <div className="mb-6">
        <Button asChild variant="outline" size="sm">
            <Link href="/admin/site-maintenance">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to General Settings
            </Link>
        </Button>
      </div>

       <div className="grid gap-4 md:grid-cols-2">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalUsers}</div>
                <p className="text-xs text-muted-foreground">All registered users on the platform.</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Newly Registered (30 days)</CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">+{newlyRegisteredUsers}</div>
                 <p className="text-xs text-muted-foreground">New sign-ups in the last month.</p>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Accounts</CardTitle>
          <CardDescription>Manage user accounts and permissions.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead className="hidden md:table-cell">Email</TableHead>
                            <TableHead className="hidden sm:table-cell">Total Balance</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage asChild src={user.avatarUrl}>
                                                <Image src={user.avatarUrl} alt={user.name} width={36} height={36} />
                                            </AvatarImage>
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="grid gap-0.5">
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-xs text-muted-foreground">{user.username}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                                <TableCell className="hidden sm:table-cell font-mono">{formatCurrency(user.totalBalance)}</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant={getStatusVariant(user.status)}>{user.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button asChild variant="ghost" size="icon">
                                            <Link href={`/admin/site-maintenance/users/edit/${user.id}`}>
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                         <Button asChild variant="ghost" size="icon">
                                            <Link href={`/admin/site-maintenance/users/settings/${user.id}`}>
                                                <Settings className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
