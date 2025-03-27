import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, CheckCircle, Clock, XCircle, BarChart, Activity, Users } from "lucide-react";
import Layout from "@/components/layout/layout";
import { Application } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";

// Placeholder component for when there's no data
const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4">
    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
    <p className="text-muted-foreground text-center">{message}</p>
  </div>
);

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("applications");

  // Fetch user's applications
  const {
    data: applications,
    isLoading: applicationsLoading,
    error: applicationsError,
  } = useQuery<Application[]>({
    queryKey: ["/api/user/applications"],
    enabled: !!user, // Only run query if user is logged in
  });

  // Mock projects data (to be replaced with actual API call when backend is ready)
  const projects = [
    {
      id: 1,
      title: "Website Redesign",
      status: "in-progress",
      completionPercentage: 65,
      startDate: "2023-02-15",
      estimatedEndDate: "2023-04-30",
      description: "Complete redesign of corporate website with modern UI/UX",
    },
    {
      id: 2,
      title: "Mobile App Development",
      status: "planning",
      completionPercentage: 15,
      startDate: "2023-03-10",
      estimatedEndDate: "2023-06-15",
      description: "iOS and Android application for customer engagement",
    },
  ];

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

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="applications">Job Applications</TabsTrigger>
            <TabsTrigger value="projects">My Projects</TabsTrigger>
          </TabsList>
          
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
                            <CardTitle className="text-xl">{application.position || "Position"}</CardTitle>
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
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <EmptyState message="You don't have any active projects at the moment." />
              )}
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <p className="text-blue-800 text-sm">
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