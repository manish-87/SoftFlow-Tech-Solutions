import { useState } from "react";
import AdminLayout from "@/components/admin/admin-layout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Message } from "@shared/schema";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
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
  DialogFooter,
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
  Mail,
  Search,
  Eye,
  Trash2,
  MoreVertical,
  CheckCircle,
  Clock,
  Briefcase,
  Building,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Messages() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<number | null>(null);

  // Fetch messages
  const { data: messages, isLoading } = useQuery<Message[]>({
    queryKey: ["/api/admin/messages"],
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("PUT", `/api/admin/messages/${id}/read`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/messages"] });
      toast({
        title: "Message marked as read",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to mark message as read: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/messages/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Message deleted",
        description: "The message has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/messages"] });
      setIsDeleteDialogOpen(false);
      setMessageToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete message: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Filter messages based on search term
  const filteredMessages = messages?.filter(
    (message) =>
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (message.company &&
        message.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle view message
  const handleViewMessage = (message: Message) => {
    setSelectedMessage(message);
    if (!message.read) {
      markAsReadMutation.mutate(message.id);
    }
  };

  // Handle delete message
  const handleDeleteClick = (id: number) => {
    setMessageToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (messageToDelete) {
      deleteMessageMutation.mutate(messageToDelete);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight font-sans">
            Messages
          </h1>
          <p className="text-muted-foreground">
            Manage and respond to client inquiries
          </p>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Inbox</CardTitle>
            <CardDescription>
              You have{" "}
              {messages?.filter((message) => !message.read).length || 0} unread
              messages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <Search className="h-4 w-4 mr-2 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            {isLoading ? (
              <div className="text-center py-8">Loading messages...</div>
            ) : filteredMessages && filteredMessages.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMessages.map((message) => (
                      <TableRow
                        key={message.id}
                        className={!message.read ? "font-medium" : ""}
                      >
                        <TableCell>
                          {message.read ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Clock className="h-4 w-4 text-amber-500" />
                          )}
                        </TableCell>
                        <TableCell>
                          <div>{message.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {message.email}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[300px] truncate">
                          {message.message}
                        </TableCell>
                        <TableCell>
                          {format(
                            new Date(message.createdAt),
                            "MMM d, yyyy HH:mm"
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
                                onClick={() => handleViewMessage(message)}
                              >
                                <Eye className="h-4 w-4 mr-2" /> View
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(message.id)}
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
                <Mail className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>No messages found</p>
                {searchTerm && (
                  <p className="text-sm mt-1">
                    Try adjusting your search criteria
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* View Message Dialog */}
        <Dialog
          open={selectedMessage !== null}
          onOpenChange={(open) => {
            if (!open) setSelectedMessage(null);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Message</DialogTitle>
            </DialogHeader>
            {selectedMessage && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      From
                    </h3>
                    <p>{selectedMessage.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Email
                    </h3>
                    <p>{selectedMessage.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Company
                    </h3>
                    <div className="flex items-center gap-1">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <p>{selectedMessage.company || "Not specified"}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Service
                    </h3>
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      {selectedMessage.service ? (
                        <Badge variant="outline">
                          {selectedMessage.service}
                        </Badge>
                      ) : (
                        <p>Not specified</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Message
                  </h3>
                  <div className="p-4 bg-muted rounded-md">
                    <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  Received on{" "}
                  {format(
                    new Date(selectedMessage.createdAt),
                    "MMMM d, yyyy 'at' HH:mm:ss"
                  )}
                </div>
              </div>
            )}
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setSelectedMessage(null)}
              >
                Close
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (selectedMessage) {
                    handleDeleteClick(selectedMessage.id);
                    setSelectedMessage(null);
                  }
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </Button>
            </DialogFooter>
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
                This action cannot be undone. This will permanently delete the
                message from your inbox.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setMessageToDelete(null)}>
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
