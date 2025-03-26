import { useState } from "react";
import AdminLayout from "@/components/admin/admin-layout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { BlogPost } from "@shared/schema";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Eye,
  Pencil,
  Trash2,
  MoreVertical,
  FileText,
  Search,
  Plus,
  FilePenLine,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import BlogEditor from "@/components/admin/blog-editor";

export default function BlogManagement() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<BlogPost | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<number | null>(null);

  // Fetch blog posts
  const { data: blogs, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blogs"],
  });

  // Delete blog mutation
  const deleteBlogMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/blogs/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Blog post deleted",
        description: "The blog post has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/blogs"] });
      setIsDeleteDialogOpen(false);
      setBlogToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete blog post: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Filter blogs based on search term
  const filteredBlogs = blogs?.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle view/edit blog
  const handleViewBlog = (blog: BlogPost) => {
    setCurrentBlog(blog);
    setIsEditing(false);
  };

  const handleEditBlog = (blog: BlogPost) => {
    setCurrentBlog(blog);
    setIsEditing(true);
  };

  // Handle delete blog
  const handleDeleteClick = (id: number) => {
    setBlogToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (blogToDelete) {
      deleteBlogMutation.mutate(blogToDelete);
    }
  };

  // Handle create new blog
  const handleCreateNew = () => {
    setCurrentBlog(null);
    setIsCreating(true);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-sans">
              Blog Management
            </h1>
            <p className="text-muted-foreground">
              Create, edit and manage blog posts
            </p>
          </div>
          <Button onClick={handleCreateNew} className="shrink-0">
            <Plus className="h-4 w-4 mr-2" /> Create New Post
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Blog Posts</CardTitle>
            <CardDescription>
              You have {blogs?.length || 0} blog posts in total
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <Search className="h-4 w-4 mr-2 text-muted-foreground" />
              <Input
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            {isLoading ? (
              <div className="text-center py-8">Loading blog posts...</div>
            ) : filteredBlogs && filteredBlogs.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBlogs.map((blog) => (
                      <TableRow key={blog.id}>
                        <TableCell className="font-medium truncate max-w-[200px]">
                          {blog.title}
                        </TableCell>
                        <TableCell>{blog.category}</TableCell>
                        <TableCell>
                          {blog.published ? (
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="h-4 w-4 mr-1" />{" "}
                              Published
                            </div>
                          ) : (
                            <div className="flex items-center text-amber-600">
                              <XCircle className="h-4 w-4 mr-1" /> Draft
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {format(
                            new Date(blog.createdAt),
                            "MMM d, yyyy"
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
                                onClick={() => handleViewBlog(blog)}
                              >
                                <Eye className="h-4 w-4 mr-2" /> View
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEditBlog(blog)}
                              >
                                <Pencil className="h-4 w-4 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(blog.id)}
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
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>No blog posts found</p>
                {searchTerm && (
                  <p className="text-sm mt-1">
                    Try adjusting your search criteria
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Blog Editor Dialog */}
        <Dialog
          open={isEditing || isCreating}
          onOpenChange={(open) => {
            if (!open) {
              setIsEditing(false);
              setIsCreating(false);
              setCurrentBlog(null);
            }
          }}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isCreating ? (
                  <div className="flex items-center">
                    <Plus className="h-5 w-5 mr-2" /> Create New Blog Post
                  </div>
                ) : (
                  <div className="flex items-center">
                    <FilePenLine className="h-5 w-5 mr-2" /> Edit Blog Post
                  </div>
                )}
              </DialogTitle>
            </DialogHeader>
            <BlogEditor
              initialData={currentBlog}
              onClose={() => {
                setIsEditing(false);
                setIsCreating(false);
                setCurrentBlog(null);
              }}
            />
          </DialogContent>
        </Dialog>

        {/* View Blog Dialog */}
        <Dialog
          open={!isEditing && !isCreating && currentBlog !== null}
          onOpenChange={(open) => {
            if (!open) setCurrentBlog(null);
          }}
        >
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{currentBlog?.title}</DialogTitle>
            </DialogHeader>
            {currentBlog && (
              <div className="mt-4">
                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                  <div>Category: {currentBlog.category}</div>
                  <div>
                    Status:{" "}
                    {currentBlog.published ? "Published" : "Draft"}
                  </div>
                  <div>
                    Created:{" "}
                    {format(
                      new Date(currentBlog.createdAt),
                      "MMMM d, yyyy"
                    )}
                  </div>
                </div>

                {currentBlog.coverImage && (
                  <img
                    src={currentBlog.coverImage}
                    alt={currentBlog.title}
                    className="mb-4 rounded-md max-h-64 object-cover w-full"
                  />
                )}

                <div className="mb-4">
                  <h3 className="font-bold mb-2">Summary</h3>
                  <p>{currentBlog.summary}</p>
                </div>

                <div>
                  <h3 className="font-bold mb-2">Content</h3>
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: currentBlog.content }}
                  />
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentBlog(null)}
                  >
                    Close
                  </Button>
                  <Button onClick={() => handleEditBlog(currentBlog)}>
                    Edit Blog
                  </Button>
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
                This action cannot be undone. This will permanently delete the
                blog post from your database.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setBlogToDelete(null)}>
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
