import AdminLayout from "@/components/admin/admin-layout";
import { useQuery } from "@tanstack/react-query";
import { BlogPost, Message, Career, Application, User, Project } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import {
  MessageSquare,
  FileText,
  Users,
  Briefcase,
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  UserCheck,
  Shield,
  Folder,
} from "lucide-react";

export default function Dashboard() {
  // Fetch data needed for dashboard
  const { data: blogs } = useQuery<BlogPost[]>({
    queryKey: ["/api/blogs"],
  });

  const { data: messages } = useQuery<Message[]>({
    queryKey: ["/api/admin/messages"],
  });

  const { data: careers } = useQuery<Career[]>({
    queryKey: ["/api/careers"],
  });

  const { data: applications } = useQuery<Application[]>({
    queryKey: ["/api/admin/applications"],
  });
  
  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });
  
  const { data: projects } = useQuery<Project[]>({
    queryKey: ["/api/admin/projects"],
  });

  // Calculate statistics
  const unreadMessages = messages?.filter((msg) => !msg.read).length || 0;
  const totalBlogs = blogs?.length || 0;
  const publishedBlogs = blogs?.filter((blog) => blog.published).length || 0;
  const draftBlogs = totalBlogs - publishedBlogs;

  const totalJobs = careers?.length || 0;
  const activeJobs = careers?.filter((job) => job.published).length || 0;

  const totalApplications = applications?.length || 0;
  const pendingApplications = applications?.filter(
    (app) => app.status === "pending"
  ).length || 0;
  
  const totalUsers = users?.length || 0;
  const verifiedUsers = users?.filter((user) => user.isVerified).length || 0;
  
  const totalProjects = projects?.length || 0;
  const activeProjects = projects?.filter(project => 
    project.status === "in-progress" || project.status === "planning" || project.status === "review"
  ).length || 0;
  const completedProjects = projects?.filter(project => project.status === "completed").length || 0;

  // Chart data
  const blogCategoryData = blogs
    ? Array.from(
        blogs.reduce((map, blog) => {
          const count = map.get(blog.category) || 0;
          map.set(blog.category, count + 1);
          return map;
        }, new Map<string, number>())
      ).map(([name, value]) => ({ name, value }))
    : [];

  const applicationStatusData = applications
    ? Array.from(
        applications.reduce((map, app) => {
          const count = map.get(app.status) || 0;
          map.set(app.status, count + 1);
          return map;
        }, new Map<string, number>())
      ).map(([name, value]) => ({ name, value }))
    : [];
    
  const projectStatusData = projects
    ? Array.from(
        projects.reduce((map, project) => {
          const count = map.get(project.status) || 0;
          map.set(project.status, count + 1);
          return map;
        }, new Map<string, number>())
      ).map(([name, value]) => ({ name, value }))
    : [];

  // Mock data for message trends (since we don't have date filtering in our API)
  const messageTrendData = [
    { day: "Mon", count: 4 },
    { day: "Tue", count: 7 },
    { day: "Wed", count: 5 },
    { day: "Thu", count: 8 },
    { day: "Fri", count: 12 },
    { day: "Sat", count: 3 },
    { day: "Sun", count: 2 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <AdminLayout title="Dashboard">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight font-sans">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your website statistics and activities
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Users</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {verifiedUsers} verified users
              </p>
              <div className="mt-2">
                <Link href="/admin/users">
                  <Button variant="outline" size="sm" className="w-full">
                    Manage Users
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{messages?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                {unreadMessages} unread messages
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBlogs}</div>
              <p className="text-xs text-muted-foreground">
                {publishedBlogs} published, {draftBlogs} drafts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Job Openings</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalJobs}</div>
              <p className="text-xs text-muted-foreground">
                {activeJobs} active positions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Job Applications
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalApplications}</div>
              <p className="text-xs text-muted-foreground">
                {pendingApplications} pending review
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projects</CardTitle>
              <Folder className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProjects}</div>
              <p className="text-xs text-muted-foreground">
                {activeProjects} active, {completedProjects} completed
              </p>
              <div className="mt-2">
                <Link href="/admin/users">
                  <Button variant="outline" size="sm" className="w-full">
                    Manage Projects
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="recent">Recent Activities</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {/* Blog Categories Chart */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Blog Posts by Category</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  {blogCategoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={blogCategoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {blogCategoryData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      No blog data available
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Application Status Chart */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Application Status</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  {applicationStatusData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={applicationStatusData}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis
                          dataKey="name"
                          type="category"
                          tick={{ fontSize: 12 }}
                        />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      No application data available
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Project Status Chart */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Project Status Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  {projectStatusData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={projectStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {projectStatusData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      No project data available
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Message Trends */}
              <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                  <CardTitle>Weekly Message Trends</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={messageTrendData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Website Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Detailed analytics will be available in a future update.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
              {/* Recent Messages */}
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Recent Messages</span>
                    <Link href="/admin/messages">
                      <Button variant="outline" size="sm">
                        View All
                      </Button>
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {messages && messages.length > 0 ? (
                    <div className="space-y-4">
                      {messages.slice(0, 5).map((message) => (
                        <div
                          key={message.id}
                          className="flex justify-between items-start border-b pb-3"
                        >
                          <div>
                            <div className="font-medium text-sm flex items-center gap-1">
                              {message.name}
                              {!message.read && (
                                <span className="bg-sky-500 h-2 w-2 rounded-full"></span>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {message.email}
                            </div>
                            <div className="text-sm mt-1 line-clamp-1">
                              {message.message}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {message.read ? (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Clock className="h-4 w-4 text-amber-500" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      No messages available
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Recent Applications */}
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Recent Applications</span>
                    <Link href="/admin/careers">
                      <Button variant="outline" size="sm">
                        View All
                      </Button>
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {applications && applications.length > 0 ? (
                    <div className="space-y-4">
                      {applications.slice(0, 5).map((app) => (
                        <div
                          key={app.id}
                          className="flex justify-between items-start border-b pb-3"
                        >
                          <div>
                            <div className="font-medium text-sm">{app.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {app.email}
                            </div>
                            <div className="text-sm mt-1">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                  app.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : app.status === "rejected"
                                    ? "bg-red-100 text-red-800"
                                    : app.status === "hired"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-sky-100 text-sky-800"
                                }`}
                              >
                                {app.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {app.status === "pending" ? (
                              <Clock className="h-4 w-4 text-amber-500" />
                            ) : app.status === "rejected" ? (
                              <XCircle className="h-4 w-4 text-red-500" />
                            ) : app.status === "hired" ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <Eye className="h-4 w-4 text-sky-500" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      No applications available
                    </p>
                  )}
                </CardContent>
              </Card>
              
              {/* Recent Projects */}
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Recent Projects</span>
                    <Link href="/admin/users">
                      <Button variant="outline" size="sm">
                        View All
                      </Button>
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {projects && projects.length > 0 ? (
                    <div className="space-y-4">
                      {projects.slice(0, 5).map((project) => (
                        <div
                          key={project.id}
                          className="flex justify-between items-start border-b pb-3"
                        >
                          <div>
                            <div className="font-medium text-sm">{project.title}</div>
                            <div className="text-xs text-muted-foreground">
                              User ID: {project.userId}
                            </div>
                            <div className="text-sm mt-1">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                  project.status === "planning"
                                    ? "bg-purple-100 text-purple-800"
                                    : project.status === "in-progress"
                                    ? "bg-sky-100 text-sky-800"
                                    : project.status === "review"
                                    ? "bg-amber-100 text-amber-800"
                                    : project.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {project.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {project.status === "planning" ? (
                              <Clock className="h-4 w-4 text-purple-500" />
                            ) : project.status === "in-progress" ? (
                              <Clock className="h-4 w-4 text-sky-500" />
                            ) : project.status === "review" ? (
                              <Eye className="h-4 w-4 text-amber-500" />
                            ) : project.status === "completed" ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <Clock className="h-4 w-4 text-gray-500" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      No projects available
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
