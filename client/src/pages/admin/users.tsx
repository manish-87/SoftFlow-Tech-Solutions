import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Loader2, 
  UserCheck, 
  UserX, 
  Mail, 
  Phone, 
  Clock, 
  Users, 
  Shield, 
  Search, 
  FileText, 
  UserCog,
  Lock,
  Unlock,
  Trash2,
  ShieldAlert
} from "lucide-react";
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
  const [confirmingBlockUser, setConfirmingBlockUser] = useState<{user: User | null, block: boolean}>({user: null, block: false});
  const [confirmingPromoteUser, setConfirmingPromoteUser] = useState<User | null>(null);
  const [confirmingDeleteUser, setConfirmingDeleteUser] = useState<User | null>(null);
  
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
  
  // Block/unblock user mutation
  const blockUserMutation = useMutation({
    mutationFn: async ({ userId, blocked }: { userId: number, blocked: boolean }) => {
      const res = await apiRequest("PUT", `/api/admin/users/${userId}/block`, { blocked });
      return await res.json();
    },
    onSuccess: (user) => {
      toast({
        title: user.isBlocked ? "User blocked" : "User unblocked",
        description: user.isBlocked 
          ? `${user.username} has been blocked and can no longer log in.` 
          : `${user.username} has been unblocked and can now log in.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setConfirmingBlockUser({user: null, block: false});
    },
    onError: (error: Error) => {
      toast({
        title: "Action failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Promote user to admin mutation
  const promoteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const res = await apiRequest("PUT", `/api/admin/users/${userId}/promote`, { isAdmin: true });
      return await res.json();
    },
    onSuccess: (user) => {
      toast({
        title: "User promoted",
        description: `${user.username} has been promoted to administrator.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setConfirmingPromoteUser(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Promotion failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const res = await apiRequest("DELETE", `/api/admin/users/${userId}`);
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "User deleted",
        description: "User has been permanently deleted from the system.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setConfirmingDeleteUser(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Deletion failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleVerifyClick = (user: User) => {
    setConfirmingVerifyUser(user);
  };
  
  const confirmVerify = () => {
    if (confirmingVerifyUser) {
      verifyUserMutation.mutate(confirmingVerifyUser.id);
    }
  };
  
  const handleBlockClick = (user: User, block: boolean) => {
    setConfirmingBlockUser({user, block});
  };
  
  const confirmBlock = () => {
    if (confirmingBlockUser.user) {
      blockUserMutation.mutate({ 
        userId: confirmingBlockUser.user.id, 
        blocked: confirmingBlockUser.block 
      });
    }
  };
  
  const handlePromoteClick = (user: User) => {
    setConfirmingPromoteUser(user);
  };
  
  const confirmPromote = () => {
    if (confirmingPromoteUser) {
      promoteUserMutation.mutate(confirmingPromoteUser.id);
    }
  };
  
  const handleDeleteClick = (user: User) => {
    setConfirmingDeleteUser(user);
  };
  
  const confirmDelete = () => {
    if (confirmingDeleteUser) {
      deleteUserMutation.mutate(confirmingDeleteUser.id);
    }
  };
  
  return (
    <AdminLayout title="User Management">
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
                        <TableHead>Verification</TableHead>
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
                            {user.isBlocked ? (
                              <Badge variant="destructive">
                                <Lock className="h-3 w-3 mr-1" /> Blocked
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-green-100">
                                <Unlock className="h-3 w-3 mr-1" /> Active
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
                            <div className="flex gap-2">
                              {!user.isVerified && !user.isAdmin ? (
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
                                user.isAdmin ? null : (
                                  <Button size="sm" variant="outline" disabled>
                                    <UserCheck className="h-3 w-3 mr-2" /> Verified
                                  </Button>
                                )
                              )}
                              
                              {!user.isAdmin && (
                                user.isBlocked ? (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleBlockClick(user, false)}
                                    className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                                  >
                                    <Unlock className="h-3 w-3 mr-2" />
                                    Unblock
                                  </Button>
                                ) : (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleBlockClick(user, true)}
                                    className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                                  >
                                    <Lock className="h-3 w-3 mr-2" />
                                    Block
                                  </Button>
                                )
                              )}
                              
                              {!user.isAdmin && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handlePromoteClick(user)}
                                  className="bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100"
                                >
                                  <ShieldAlert className="h-3 w-3 mr-2" />
                                  Make Admin
                                </Button>
                              )}
                              
                              {!user.isAdmin && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleDeleteClick(user)}
                                  className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                                >
                                  <Trash2 className="h-3 w-3 mr-2" />
                                  Delete
                                </Button>
                              )}
                            </div>
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
      
      {/* Promote to Admin Confirmation Dialog */}
      <AlertDialog open={!!confirmingPromoteUser} onOpenChange={() => setConfirmingPromoteUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Make Admin</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to make {confirmingPromoteUser?.username} an admin?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-2">
            <p>This action:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>Gives the user full administrative access to the system</li>
              <li>Allows them to manage all users, content, and settings</li>
              <li>Cannot be easily reversed, and should be granted carefully</li>
            </ul>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmPromote}>
              {promoteUserMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Promoting...
                </>
              ) : (
                <>
                  <ShieldAlert className="h-4 w-4 mr-2" />
                  Make Admin
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Delete User Confirmation Dialog */}
      <AlertDialog open={!!confirmingDeleteUser} onOpenChange={() => setConfirmingDeleteUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {confirmingDeleteUser?.username}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-2">
            <p>This action:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>Permanently removes the user account and all associated data</li>
              <li>Cannot be undone</li>
            </ul>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              {deleteUserMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Block User Confirmation Dialog */}
      <AlertDialog 
        open={!!confirmingBlockUser.user} 
        onOpenChange={() => setConfirmingBlockUser({user: null, block: false})}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmingBlockUser.block ? "Block User" : "Unblock User"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {confirmingBlockUser.block ? "block" : "unblock"} {confirmingBlockUser.user?.username}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-2">
            {confirmingBlockUser.block ? (
              <>
                <p>This action:</p>
                <ul className="list-disc ml-6 mt-2">
                  <li>Prevents the user from logging into the system</li>
                  <li>Does not delete their account or data</li>
                  <li>Can be reversed later</li>
                </ul>
              </>
            ) : (
              <p>This action will restore full access to this user's account.</p>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBlock} className={confirmingBlockUser.block ? "bg-orange-600 hover:bg-orange-700" : ""}>
              {blockUserMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {confirmingBlockUser.block ? "Blocking..." : "Unblocking..."}
                </>
              ) : (
                <>
                  {confirmingBlockUser.block ? (
                    <UserX className="h-4 w-4 mr-2" />
                  ) : (
                    <UserCheck className="h-4 w-4 mr-2" />
                  )}
                  {confirmingBlockUser.block ? "Block User" : "Unblock User"}
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}