import { useState } from "react";
import AdminLayout from "@/components/admin/admin-layout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Career, Application } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Edit,
  Trash2,
  MoreVertical,
  Briefcase,
  Plus,
  FileText,
  User,
  Clock,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import CareerForm from "@/components/admin/career-form";

export default function Careers() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("careers");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentCareer, setCurrentCareer] = useState<Career | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [careerToDelete, setCareerToDelete] = useState<number | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  // Fetch careers
  const { data: careers, isLoading: careersLoading } = useQuery<Career[]>({
    queryKey: ["/api/careers"],
  });

  // Fetch applications
  const { data: applications, isLoading: applicationsLoading } = useQuery<Application[]>({
    queryKey: ["/api/admin/applications"],
  });

  // Delete career mutation
  const deleteCareerMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/careers/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Career deleted",
        description: "The career posting has been successfully removed.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/careers"] });
      setIsDeleteDialogOpen(false);
      setCareerToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete career: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update application status mutation
  const updateApplicationStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest("PUT", `/api/admin/applications/${id}/status`, { status });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Status updated",
        description: "The application status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/applications"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update status: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Filter careers based on search term
  const filteredCareers = careers?.filter((career) =>
    career.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    career.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    career.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter applications based on search term
  const filteredApplications = applications?.filter((app) =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle edit career
  const handleEditCareer = (career: Career) => {
    setCurrentCareer(career);
    setIsEditDialogOpen(true);
  };

  // Handle delete career
  const handleDeleteClick = (id: number) => {
    setCareerToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (careerToDelete) {
      deleteCareerMutation.mutate(careerToDelete);
    }
  };

  // Handle view application
  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application);
  };

  // Handle status change
  const handleStatusChange = (id: number, status: string) => {
    updateApplicationStatusMutation.mutate({ id, status });
  };

  // Get career title for an application
  const getCareerTitle = (careerId: number): string => {
    const career = careers?.find(c => c.id === careerId);
    return career ? career.title : "Unknown Position";
  };

  return (
    <AdminLayout title="Career Management">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-sans">
              Careers Management
            </h1>
            <p className="text-muted-foreground">
              Manage job postings and applications
            </p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="shrink-0">
            <Plus className="h-4 w-4 mr-2" /> Add New Job
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="careers">Job Postings</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="careers" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Available Positions</CardTitle>
                <CardDescription>
                  You have {careers?.length || 0} job postings in total
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Input
                    placeholder="Search job postings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>

                {careersLoading ? (
                  <div className="text-center py-8">Loading job postings...</div>
                ) : filteredCareers && filteredCareers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Position</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCareers.map((career) => (
                          <TableRow key={career.id}>
                            <TableCell className="font-medium">
                              {career.title}
                            </TableCell>
                            <TableCell>{career.department}</TableCell>
                            <TableCell>{career.location}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{career.type}</Badge>
                            </TableCell>
                            <TableCell>
                              {career.published ? (
                                <div className="flex items-center text-green-600">
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Active
                                </div>
                              ) : (
                                <div className="flex items-center text-gray-500">
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Draft
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => handleEditCareer(career)}
                                  >
                                    <Edit className="h-4 w-4 mr-2" /> Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteClick(career.id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Briefcase className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>No job postings found</p>
                    {searchTerm && (
                      <p className="text-sm mt-1">
                        Try adjusting your search criteria
                      </p>
                    )}
                    <Button
                      onClick={() => setIsAddDialogOpen(true)}
                      variant="outline"
                      className="mt-4"
                    >
                      <Plus className="h-4 w-4 mr-2" /> Create your first job posting
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Job Applications</CardTitle>
                <CardDescription>
                  You have {applications?.length || 0} applications in total
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Input
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>

                {applicationsLoading ? (
                  <div className="text-center py-8">Loading applications...</div>
                ) : filteredApplications && filteredApplications.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Applicant</TableHead>
                          <TableHead>Position</TableHead>
                          <TableHead>Applied On</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredApplications.map((application) => (
                          <TableRow key={application.id}>
                            <TableCell>
                              <div className="font-medium">{application.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {application.email}
                              </div>
                            </TableCell>
                            <TableCell>{getCareerTitle(application.careerId)}</TableCell>
                            <TableCell>
                              {format(new Date(application.createdAt), "MMM d, yyyy")}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  application.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                    : application.status === "reviewed"
                                    ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                    : application.status === "interviewing"
                                    ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                                    : application.status === "hired"
                                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                                    : "bg-red-100 text-red-800 hover:bg-red-100"
                                }
                                variant="outline"
                              >
                                {application.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => handleViewApplication(application)}
                                  >
                                    <Eye className="h-4 w-4 mr-2" /> View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuRadioGroup
                                    value={application.status}
                                    onValueChange={(value) => handleStatusChange(application.id, value)}
                                  >
                                    <DropdownMenuRadioItem value="pending">
                                      <Clock className="h-4 w-4 mr-2 text-yellow-500" /> Pending
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="reviewed">
                                      <Eye className="h-4 w-4 mr-2 text-blue-500" /> Reviewed
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="interviewing">
                                      <User className="h-4 w-4 mr-2 text-purple-500" /> Interviewing
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="hired">
                                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Hired
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="rejected">
                                      <XCircle className="h-4 w-4 mr-2 text-red-500" /> Rejected
                                    </DropdownMenuRadioItem>
                                  </DropdownMenuRadioGroup>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>No applications found</p>
                    {searchTerm && (
                      <p className="text-sm mt-1">
                        Try adjusting your search criteria
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Career Dialog */}
        <Dialog
          open={isAddDialogOpen}
          onOpenChange={(open) => {
            if (!open) setIsAddDialogOpen(false);
          }}
        >
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Job Posting</DialogTitle>
            </DialogHeader>
            <CareerForm
              onClose={() => setIsAddDialogOpen(false)}
              onSuccess={() => {
                queryClient.invalidateQueries({ queryKey: ["/api/careers"] });
                setIsAddDialogOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Career Dialog */}
        <Dialog
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              setIsEditDialogOpen(false);
              setCurrentCareer(null);
            }
          }}
        >
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Job Posting</DialogTitle>
            </DialogHeader>
            <CareerForm
              initialData={currentCareer}
              onClose={() => {
                setIsEditDialogOpen(false);
                setCurrentCareer(null);
              }}
              onSuccess={() => {
                queryClient.invalidateQueries({ queryKey: ["/api/careers"] });
                setIsEditDialogOpen(false);
                setCurrentCareer(null);
              }}
            />
          </DialogContent>
        </Dialog>

        {/* View Application Dialog */}
        <Dialog
          open={selectedApplication !== null}
          onOpenChange={(open) => {
            if (!open) setSelectedApplication(null);
          }}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Application Details</DialogTitle>
            </DialogHeader>
            {selectedApplication && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Applicant</h3>
                    <p className="font-medium">{selectedApplication.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Position</h3>
                    <p>{getCareerTitle(selectedApplication.careerId)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Email</h3>
                    <p>{selectedApplication.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Phone</h3>
                    <p>{selectedApplication.phone}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Resume</h3>
                  <a
                    href={selectedApplication.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    View Resume
                  </a>
                </div>

                {selectedApplication.coverLetter && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Cover Letter</h3>
                    <div className="bg-muted p-4 rounded-md max-h-64 overflow-y-auto">
                      <p className="whitespace-pre-wrap">{selectedApplication.coverLetter}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Application Date</h3>
                    <p>{format(new Date(selectedApplication.createdAt), "MMMM d, yyyy")}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <Badge
                            className={
                              selectedApplication.status === "pending"
                                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                : selectedApplication.status === "reviewed"
                                ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                : selectedApplication.status === "interviewing"
                                ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                                : selectedApplication.status === "hired"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-red-100 text-red-800 hover:bg-red-100"
                            }
                            variant="outline"
                          >
                            {selectedApplication.status}
                          </Badge>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuRadioGroup
                          value={selectedApplication.status}
                          onValueChange={(value) => handleStatusChange(selectedApplication.id, value)}
                        >
                          <DropdownMenuRadioItem value="pending">
                            <Clock className="h-4 w-4 mr-2 text-yellow-500" /> Pending
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="reviewed">
                            <Eye className="h-4 w-4 mr-2 text-blue-500" /> Reviewed
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="interviewing">
                            <User className="h-4 w-4 mr-2 text-purple-500" /> Interviewing
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="hired">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Hired
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="rejected">
                            <XCircle className="h-4 w-4 mr-2 text-red-500" /> Rejected
                          </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently remove this
                job posting from your website.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setCareerToDelete(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}
