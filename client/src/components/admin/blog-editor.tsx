import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { BlogPost, insertBlogPostSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Loader2 } from "lucide-react";

// Extend the schema with additional validation
const blogFormSchema = insertBlogPostSchema.extend({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  slug: z.string()
    .min(3, { message: "Slug must be at least 3 characters" })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { 
      message: "Slug can only contain lowercase letters, numbers, and hyphens" 
    }),
  summary: z.string().min(10, { message: "Summary must be at least 10 characters" }),
  content: z.string().min(50, { message: "Content must be at least 50 characters" }),
  category: z.string().min(2, { message: "Category is required" }),
  coverImage: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  published: z.boolean().default(false),
});

type BlogFormValues = z.infer<typeof blogFormSchema>;

interface BlogEditorProps {
  initialData?: BlogPost | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function BlogEditor({ initialData, onClose, onSuccess }: BlogEditorProps) {
  const { toast } = useToast();
  const [isGeneratingSlug, setIsGeneratingSlug] = useState(false);
  
  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      summary: initialData?.summary || "",
      content: initialData?.content || "",
      category: initialData?.category || "",
      coverImage: initialData?.coverImage || "",
      published: initialData?.published || false,
    },
  });

  // Create mutation
  const createBlogMutation = useMutation({
    mutationFn: async (data: BlogFormValues) => {
      const res = await apiRequest("POST", "/api/admin/blogs", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Blog post created",
        description: "Your blog post has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/blogs"] });
      if (onSuccess) onSuccess();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create blog post. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateBlogMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: BlogFormValues }) => {
      const res = await apiRequest("PUT", `/api/admin/blogs/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Blog post updated",
        description: "Your blog post has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/blogs"] });
      if (onSuccess) onSuccess();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update blog post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BlogFormValues) => {
    if (initialData) {
      updateBlogMutation.mutate({ id: initialData.id, data });
    } else {
      createBlogMutation.mutate(data);
    }
  };

  // Categories for the dropdown
  const categories = [
    "Case Study",
    "Tutorial",
    "News",
    "Technology",
    "Insights",
    "Client Stories",
  ];

  // Function to generate slug from title
  const generateSlugFromTitle = () => {
    const title = form.getValues("title");
    if (title) {
      setIsGeneratingSlug(true);
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "") // Remove special characters
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-") // Replace multiple hyphens with a single hyphen
        .trim();
      
      form.setValue("slug", slug, { shouldValidate: true });
      setIsGeneratingSlug(false);
    }
  };

  // Watch for title changes to auto-generate slug if slug is empty
  const title = form.watch("title");
  useEffect(() => {
    if (!initialData && !form.getValues("slug") && title) {
      generateSlugFromTitle();
    }
  }, [title, form, initialData]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter post title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      placeholder="url-friendly-name"
                      {...field}
                      disabled={isGeneratingSlug}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={generateSlugFromTitle}
                    disabled={isGeneratingSlug || !form.getValues("title")}
                  >
                    {isGeneratingSlug ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <PlusCircle className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Summary</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief summary of the post"
                  className="resize-none"
                  rows={2}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com/image.jpg"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your blog post content here..."
                  className="min-h-[300px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Published Status</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Set to published to make this post visible on the website
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              createBlogMutation.isPending || updateBlogMutation.isPending
            }
          >
            {(createBlogMutation.isPending || updateBlogMutation.isPending) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {initialData ? "Update Post" : "Create Post"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
