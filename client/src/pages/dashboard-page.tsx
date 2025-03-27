import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, CheckCircle, Clock, XCircle, BarChart, Activity, Users, MessageSquare, User, Settings, Receipt } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Layout from "@/components/layout/layout";
import { Application, Message, Project, User as UserType, Invoice } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, Link } from "wouter";
import { InvoiceStatusBadge } from "@/components/invoices/invoice-status-badge";

// Placeholder component for when there's no data
const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4">
    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
    <p className="text-muted-foreground text-center">{message}</p>
  </div>
);

// Profile form schema 
const profileSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  photo: z.string().optional().nullable(),
  githubUrl: z.string().url("Please enter a valid URL").optional().nullable(),
  linkedinUrl: z.string().url("Please enter a valid URL").optional().nullable(),
  portfolioUrl: z.string().url("Please enter a valid URL").optional().nullable(),
  bio: z.string().optional().nullable(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");

  // Fetch user's applications
  const {
    data: applications,
    isLoading: applicationsLoading,
    error: applicationsError,
  } = useQuery<Application[]>({
    queryKey: ["/api/user/applications"],
    enabled: !!user, // Only run query if user is logged in
    queryFn: async () => {
      const res = await fetch(`/api/user/applications?email=${user?.email}`);
      if (!res.ok) throw new Error('Failed to fetch applications');
      return res.json();
    }
  });

  // Fetch user's messages
  const {
    data: messages,
    isLoading: messagesLoading,
    error: messagesError,
  } = useQuery<Message[]>({
    queryKey: ["/api/user/messages"],
    enabled: !!user, // Only run query if user is logged in
    queryFn: async () => {
      const res = await fetch(`/api/user/messages?email=${user?.email}`);
      if (!res.ok) throw new Error('Failed to fetch messages');
      return res.json();
    }
  });

  // Fetch user's projects
  const {
    data: projects,
    isLoading: projectsLoading,
    error: projectsError,
  } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    enabled: !!user, // Only run query if user is logged in
  });
  
  // Track project invoices data
  const [projectInvoices, setProjectInvoices] = useState<{ [key: number]: Invoice[] }>({});
  
  // Fetch invoices for each project when projects change
  useEffect(() => {
    if (projects && projects.length > 0 && activeTab === "projects") {
      // Create an async function to fetch invoices for each project
      const fetchProjectInvoices = async () => {
        const invoicesData: { [key: number]: Invoice[] } = {};
        
        // Fetch invoices for each project
        for (const project of projects) {
          try {
            const res = await fetch(`/api/projects/${project.id}/invoices`);
            if (res.ok) {
              const data = await res.json();
              invoicesData[project.id] = data;
            }
          } catch (error) {
            console.error(`Error fetching invoices for project ${project.id}:`, error);
          }
        }
        
        setProjectInvoices(invoicesData);
      };
      
      fetchProjectInvoices();
    }
  }, [projects, activeTab]);

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Redirect to="/auth" />;
  }

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge for applications
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending Review</Badge>;
      case "reviewed":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Reviewed</Badge>;
      case "interviewing":
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">Interviewing</Badge>;
      case "hired":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Hired</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Not Selected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Get status badge for projects
  const getProjectStatusBadge = (status: string) => {
    switch (status) {
      case "planning":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Planning</Badge>;
      case "in-progress":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      case "review":
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">Under Review</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>;
      case "on-hold":
        return <Badge variant="outline" className="bg-red-100 text-red-800">On Hold</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Get icon for application status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "reviewed":
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case "interviewing":
        return <Users className="h-5 w-5 text-purple-500" />;
      case "hired":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      const res = await apiRequest("PUT", "/api/user/profile", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
        variant: "default",
      });
      // Refresh user data
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update profile",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Profile form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: user?.email || "",
      phone: user?.phone || "",
      photo: user?.photo || "",
      githubUrl: user?.githubUrl || "",
      linkedinUrl: user?.linkedinUrl || "",
      portfolioUrl: user?.portfolioUrl || "",
      bio: user?.bio || "",
    },
  });

  const onSubmitProfile = (data: ProfileFormValues) => {
    updateProfileMutation.mutate(data);
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="messages">My Messages</TabsTrigger>
            <TabsTrigger value="applications">Job Applications</TabsTrigger>
            <TabsTrigger value="projects">My Projects</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <div className="grid grid-cols-1 gap-6">
              <h2 className="text-2xl font-semibold mb-4">My Profile</h2>
              
              <Card>
                <CardHeader>
                  <div className="flex flex-col items-center md:flex-row md:items-start gap-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={user?.photo || ""} alt={user?.username || ""} />
                      <AvatarFallback className="text-xl">{getInitials(user?.username || "")}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-2xl">{user?.username}</CardTitle>
                      <CardDescription className="mt-2">{user?.email}</CardDescription>
                      <div className="mt-2">
                        {user?.isVerified ? (
                          <Badge className="bg-green-500">
                            <CheckCircle className="mr-1 h-3 w-3" /> Verified Profile
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-amber-500 text-amber-500">
                            <Clock className="mr-1 h-3 w-3" /> Pending Verification
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmitProfile)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="email"
                                  disabled={user?.isVerified} 
                                />
                              </FormControl>
                              {user?.isVerified && (
                                <FormDescription>
                                  Email cannot be changed after verification
                                </FormDescription>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  disabled={user?.isVerified} 
                                />
                              </FormControl>
                              {user?.isVerified && (
                                <FormDescription>
                                  Phone number cannot be changed after verification
                                </FormDescription>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="photo"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Profile Photo URL</FormLabel>
                              <FormControl>
                                <Input {...field} value={field.value || ""} placeholder="https://example.com/photo.jpg" />
                              </FormControl>
                              <FormDescription>
                                Enter a URL to your profile photo
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Professional Links</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="githubUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>GitHub Profile</FormLabel>
                                <FormControl>
                                  <Input {...field} value={field.value || ""} placeholder="https://github.com/username" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="linkedinUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>LinkedIn Profile</FormLabel>
                                <FormControl>
                                  <Input {...field} value={field.value || ""} placeholder="https://linkedin.com/in/username" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="portfolioUrl"
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel>Portfolio Website</FormLabel>
                                <FormControl>
                                  <Input {...field} value={field.value || ""} placeholder="https://yourportfolio.com" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Input {...field} value={field.value || ""} placeholder="Tell us about yourself" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end">
                        <Button 
                          type="submit" 
                          disabled={updateProfileMutation.isPending}
                          className="min-w-[120px]"
                        >
                          {updateProfileMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : null}
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="messages">
            <div className="grid grid-cols-1 gap-6">
              <h2 className="text-2xl font-semibold mb-2">My Messages</h2>
              
              {messagesLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : messagesError ? (
                <div className="text-red-500 py-6">
                  Error loading your messages. Please try again later.
                </div>
              ) : messages && messages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {messages.map((message) => (
                    <Card key={message.id} className="border border-neutral-200">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">
                              {message.service ? `Regarding: ${message.service}` : 'General Inquiry'}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              Sent on {formatDate(message.createdAt.toString())}
                            </CardDescription>
                          </div>
                          <Badge variant={message.read ? "outline" : "default"}>
                            {message.read ? 'Responded' : 'Pending Response'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                          <MessageSquare className="h-5 w-5 text-primary" />
                          <span>
                            {message.read ? 'Your message has been read and responded to.' : 'Your message is being reviewed by our team.'}
                          </span>
                        </div>
                        
                        <div className="border-t border-neutral-200 mt-4 pt-4">
                          <h4 className="font-medium mb-2">Message</h4>
                          <p className="text-sm text-gray-700">{message.message}</p>
                        </div>
                        
                        {message.company && (
                          <div className="mt-4 text-sm">
                            <span className="text-muted-foreground">Company: </span>
                            <span>{message.company}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <EmptyState message="You haven't sent any messages yet." />
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="applications">
            <div className="grid grid-cols-1 gap-6">
              <h2 className="text-2xl font-semibold mb-2">My Applications</h2>
              
              {applicationsLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : applicationsError ? (
                <div className="text-red-500 py-6">
                  Error loading your applications. Please try again later.
                </div>
              ) : applications && applications.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {applications.map((application) => (
                    <Card key={application.id} className="border border-neutral-200">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">
                              {application.careerId ? `Job Application #${application.careerId}` : "Job Application"}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              Applied on {formatDate(application.createdAt.toString())}
                            </CardDescription>
                          </div>
                          {getStatusBadge(application.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                          {getStatusIcon(application.status)}
                          <span>
                            {application.status === "pending" ? "Your application is pending review" :
                             application.status === "reviewed" ? "Your application has been reviewed" :
                             application.status === "interviewing" ? "You've been selected for an interview" :
                             application.status === "hired" ? "Congratulations! You've been hired" :
                             application.status === "rejected" ? "Thank you for your interest" :
                             "Application status updated"}
                          </span>
                        </div>
                        
                        <div className="border-t border-neutral-200 mt-4 pt-4">
                          <h4 className="font-medium mb-2">Application Details</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-muted-foreground">Email:</div>
                            <div>{application.email}</div>
                            <div className="text-muted-foreground">Phone:</div>
                            <div>{application.phone}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <EmptyState message="You haven't submitted any job applications yet." />
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="projects">
            <div className="grid grid-cols-1 gap-6">
              <h2 className="text-2xl font-semibold mb-2">My Projects</h2>
              
              {projects && projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.map((project) => (
                    <Card key={project.id} className="border border-neutral-200">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">{project.title}</CardTitle>
                            <CardDescription className="mt-1">
                              Started on {formatDate(project.startDate)}
                            </CardDescription>
                          </div>
                          {getProjectStatusBadge(project.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">
                          <p className="text-sm text-muted-foreground">{project.description}</p>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-sm font-medium mb-1">Completion: {project.completionPercentage}%</p>
                          <div className="w-full bg-neutral-200 rounded-full h-2.5">
                            <div
                              className="bg-primary h-2.5 rounded-full"
                              style={{ width: `${project.completionPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="border-t border-neutral-200 mt-4 pt-4">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-muted-foreground">Start Date:</div>
                            <div>{formatDate(project.startDate)}</div>
                            <div className="text-muted-foreground">Target Completion:</div>
                            <div>{formatDate(project.estimatedEndDate)}</div>
                            
                            {/* Display payment status */}
                            {projectInvoices[project.id] && projectInvoices[project.id].length > 0 && (
                              <>
                                <div className="text-muted-foreground">Payment Status:</div>
                                <div className="flex items-center space-x-2">
                                  {projectInvoices[project.id].every(invoice => invoice.status === 'paid') ? (
                                    <Badge variant="outline" className="bg-green-100 text-green-800">
                                      <CheckCircle className="mr-1 h-3 w-3" /> Paid
                                    </Badge>
                                  ) : projectInvoices[project.id].some(invoice => invoice.status === 'paid') ? (
                                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                                      <Clock className="mr-1 h-3 w-3" /> Partially Paid
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="bg-red-100 text-red-800">
                                      <XCircle className="mr-1 h-3 w-3" /> Unpaid
                                    </Badge>
                                  )}
                                  <Link href="/invoices">
                                    <span className="text-xs text-primary flex items-center hover:underline cursor-pointer">
                                      <Receipt className="h-3 w-3 mr-1" />
                                      View Invoices
                                    </span>
                                  </Link>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <EmptyState message="You don't have any active projects at the moment." />
              )}
              
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 mt-6">
                <p className="text-neutral-800 text-sm">
                  <strong>Note:</strong> The projects section will be updated when you have active projects with SoftFlow.
                  Your project manager will keep this information up-to-date as your project progresses.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}