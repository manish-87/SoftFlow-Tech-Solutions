import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, UserCheck, UserX, Mail, Phone, Clock, Users, Shield, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { User } from "@shared/schema";
import AdminLayout from "@/components/admin/admin-layout";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function UsersManagement() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmingVerifyUser, setConfirmingVerifyUser] = useState<User | null>(null);
  
  // Fetch all users
  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
  } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });
  
  // Verify user mutation
  const verifyUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const res = await apiRequest("PUT", `/api/admin/users/${userId}/verify`);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "User verified",
        description: "User has been verified successfully.",
      });
      // Refresh users list
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setConfirmingVerifyUser(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Verification failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Filter users based on search term
  const filteredUsers = users?.filter(user => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    
    return (
      user.username.toLowerCase().includes(searchLower) ||
      (user.email && user.email.toLowerCase().includes(searchLower)) ||
      (user.phone && user.phone.toLowerCase().includes(searchLower))
    );
  });
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  const handleVerifyClick = (user: User) => {
    setConfirmingVerifyUser(user);
  };
  
  const confirmVerify = () => {
    if (confirmingVerifyUser) {
      verifyUserMutation.mutate(confirmingVerifyUser.id);
    }
  };
  
  return (
    <AdminLayout>
      <div className="container py-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground mt-1">
              View and manage all users in the system
            </p>
          </div>
          
          <div className="mt-4 lg:mt-0 w-full lg:w-auto flex items-center gap-2">
            <div className="relative w-full lg:w-[300px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Users</CardTitle>
                {users && (
                  <Badge variant="outline" className="ml-2">
                    <Users className="h-3.5 w-3.5 mr-1" />
                    {users.length} user{users.length !== 1 ? "s" : ""}
                  </Badge>
                )}
              </div>
              <CardDescription>
                Manage registered users and update their verification status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
              ) : usersError ? (
                <div className="bg-destructive/10 text-destructive p-4 rounded-md">
                  <p>Failed to load users. Please try again.</p>
                </div>
              ) : filteredUsers && filteredUsers.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.photo || ""} alt={user.username} />
                                <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.username}</p>
                                <p className="text-xs text-muted-foreground">ID: {user.id}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{user.email || "Not provided"}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{user.phone || "Not provided"}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {user.isVerified ? (
                              <Badge className="bg-green-500">
                                <UserCheck className="h-3 w-3 mr-1" /> Verified
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-amber-500 border-amber-500">
                                <Clock className="h-3 w-3 mr-1" /> Pending
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {user.isAdmin ? (
                              <Badge variant="secondary">
                                <Shield className="h-3 w-3 mr-1" /> Admin
                              </Badge>
                            ) : (
                              <Badge variant="outline">User</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {!user.isVerified ? (
                              <Button 
                                size="sm" 
                                variant="default"
                                onClick={() => handleVerifyClick(user)}
                                disabled={verifyUserMutation.isPending && confirmingVerifyUser?.id === user.id}
                              >
                                {verifyUserMutation.isPending && confirmingVerifyUser?.id === user.id ? (
                                  <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                                ) : (
                                  <UserCheck className="h-3 w-3 mr-2" />
                                )}
                                Verify
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline" disabled>
                                <UserCheck className="h-3 w-3 mr-2" /> Verified
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="bg-muted/50 p-8 rounded-md flex flex-col items-center justify-center text-center">
                  <UserX className="h-10 w-10 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium">No users found</h3>
                  <p className="text-muted-foreground mt-1 max-w-md">
                    {searchTerm ? "No users match your search criteria. Try a different search term." : "There are no registered users in the system yet."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Verification Confirmation Dialog */}
      <AlertDialog open={!!confirmingVerifyUser} onOpenChange={() => setConfirmingVerifyUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Verify User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to verify <strong>{confirmingVerifyUser?.username}</strong>?
              <br /><br />
              This action:
              <ul className="list-disc ml-6 mt-2">
                <li>Confirms the user's identity and gives them full access</li>
                <li>Locks their email and phone number so they cannot be changed</li>
                <li>Cannot be undone</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmVerify}>
              {verifyUserMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify User"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}