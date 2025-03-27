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
  FolderPlus, 
  PlusCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { User, InsertProject } from "@shared/schema";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Project form schema
const projectFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  startDate: z.string().min(1, "Start date is required"),
  estimatedEndDate: z.string().min(1, "Estimated end date is required"),
  serviceType: z.string().min(1, "Service type is required"),
  status: z.string().default("planning"),
  completionPercentage: z.number().default(0),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

export default function UsersManagement() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmingVerifyUser, setConfirmingVerifyUser] = useState<User | null>(null);
  const [addProjectUser, setAddProjectUser] = useState<User | null>(null);
  
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
  
  // Create project form setup
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: new Date().toISOString().substring(0, 10),
      estimatedEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10), // Default to 30 days from now
      serviceType: "",
      status: "planning",
      completionPercentage: 0,
    }
  });
  
  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: async ({ userId, project }: { userId: number, project: ProjectFormValues }) => {
      const formattedProject = {
        ...project,
        userId,
        startDate: new Date(project.startDate).toISOString(),
        estimatedEndDate: new Date(project.estimatedEndDate).toISOString()
      };
      
      const res = await apiRequest("POST", `/api/admin/users/${userId}/projects`, formattedProject);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Project created",
        description: `Project has been created successfully for ${addProjectUser?.username}.`,
      });
      form.reset();
      setAddProjectUser(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create project",
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
  
  const handleAddProjectClick = (user: User) => {
    setAddProjectUser(user);
    form.reset({
      title: "",
      description: "",
      startDate: new Date().toISOString().substring(0, 10),
      estimatedEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
      serviceType: "",
      status: "planning",
      completionPercentage: 0,
    });
  };
  
  const onProjectSubmit = (data: ProjectFormValues) => {
    if (addProjectUser) {
      createProjectMutation.mutate({ userId: addProjectUser.id, project: data });
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
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleAddProjectClick(user)}
                                >
                                  <FolderPlus className="h-3 w-3 mr-2" />
                                  Add Project
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
      
      {/* Add Project Dialog */}
      <Dialog open={!!addProjectUser} onOpenChange={(open) => !open && setAddProjectUser(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Add a new project for {addProjectUser?.username}. This will be visible in their dashboard.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onProjectSubmit)} className="space-y-4 mt-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter project description" 
                        className="min-h-[120px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="estimatedEndDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="serviceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Type</FormLabel>
                      <FormControl>
                        <select
                          className="w-full h-10 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          {...field}
                        >
                          <option value="">Select a service type</option>
                          <option value="web-development">Web Development</option>
                          <option value="mobile-development">Mobile Development</option>
                          <option value="ui-ux-design">UI/UX Design</option>
                          <option value="cloud-services">Cloud Services</option>
                          <option value="data-analytics">Data Analytics</option>
                          <option value="consulting">Consulting</option>
                          <option value="maintenance">Maintenance</option>
                          <option value="testing-qa">Testing & QA</option>
                          <option value="custom">Custom Service</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <select
                          className="w-full h-10 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          {...field}
                        >
                          <option value="planning">Planning</option>
                          <option value="in-progress">In Progress</option>
                          <option value="review">Under Review</option>
                          <option value="completed">Completed</option>
                          <option value="on-hold">On Hold</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setAddProjectUser(null)}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createProjectMutation.isPending}
                >
                  {createProjectMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Project...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create Project
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}