import { useState } from "react";
import AdminLayout from "@/components/admin/admin-layout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Partner } from "@shared/schema";
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
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Edit,
  Trash2,
  MoreVertical,
  Building,
  Plus,
  Globe,
  LinkIcon,
} from "lucide-react";
import PartnerForm from "@/components/admin/partner-form";

export default function Partners() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPartner, setCurrentPartner] = useState<Partner | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [partnerToDelete, setPartnerToDelete] = useState<number | null>(null);

  // Fetch partners
  const { data: partners, isLoading } = useQuery<Partner[]>({
    queryKey: ["/api/partners"],
  });

  // Delete partner mutation
  const deletePartnerMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/partners/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Partner deleted",
        description: "The partner has been successfully removed.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/partners"] });
      setIsDeleteDialogOpen(false);
      setPartnerToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete partner: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Filter partners based on search term
  const filteredPartners = partners?.filter((partner) =>
    partner.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle edit partner
  const handleEditPartner = (partner: Partner) => {
    setCurrentPartner(partner);
    setIsEditDialogOpen(true);
  };

  // Handle delete partner
  const handleDeleteClick = (id: number) => {
    setPartnerToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (partnerToDelete) {
      deletePartnerMutation.mutate(partnerToDelete);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-sans">
              Partners Management
            </h1>
            <p className="text-muted-foreground">
              Manage your company's partnerships
            </p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="shrink-0">
            <Plus className="h-4 w-4 mr-2" /> Add New Partner
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Partners</CardTitle>
            <CardDescription>
              You have {partners?.length || 0} partners in total
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <Search className="h-4 w-4 mr-2 text-muted-foreground" />
              <Input
                placeholder="Search partners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            {isLoading ? (
              <div className="text-center py-8">Loading partners...</div>
            ) : filteredPartners && filteredPartners.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Logo</TableHead>
                      <TableHead>Company Name</TableHead>
                      <TableHead>Website</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPartners.map((partner) => (
                      <TableRow key={partner.id}>
                        <TableCell>
                          <div className="h-10 w-20 bg-neutral-100 flex items-center justify-center rounded overflow-hidden">
                            <img
                              src={partner.logo}
                              alt={`${partner.name} logo`}
                              className="max-h-8 max-w-full object-contain"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {partner.name}
                        </TableCell>
                        <TableCell>
                          {partner.website ? (
                            <a
                              href={partner.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline flex items-center"
                            >
                              <LinkIcon className="h-3 w-3 mr-1" />
                              {partner.website.replace(/^https?:\/\//, "")}
                            </a>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              Not provided
                            </span>
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
                                onClick={() => handleEditPartner(partner)}
                              >
                                <Edit className="h-4 w-4 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(partner.id)}
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
                <Building className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>No partners found</p>
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
                  <Plus className="h-4 w-4 mr-2" /> Add your first partner
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Partner Dialog */}
        <Dialog
          open={isAddDialogOpen}
          onOpenChange={(open) => {
            if (!open) setIsAddDialogOpen(false);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Partner</DialogTitle>
            </DialogHeader>
            <PartnerForm
              onClose={() => setIsAddDialogOpen(false)}
              onSuccess={() => {
                queryClient.invalidateQueries({ queryKey: ["/api/partners"] });
                setIsAddDialogOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Partner Dialog */}
        <Dialog
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              setIsEditDialogOpen(false);
              setCurrentPartner(null);
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Partner</DialogTitle>
            </DialogHeader>
            <PartnerForm
              initialData={currentPartner}
              onClose={() => {
                setIsEditDialogOpen(false);
                setCurrentPartner(null);
              }}
              onSuccess={() => {
                queryClient.invalidateQueries({ queryKey: ["/api/partners"] });
                setIsEditDialogOpen(false);
                setCurrentPartner(null);
              }}
            />
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
                partner from your website.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setPartnerToDelete(null)}>
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
