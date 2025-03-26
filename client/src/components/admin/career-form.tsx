import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Career, insertCareerSchema } from "@shared/schema";
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
import { Loader2 } from "lucide-react";

// Extend the schema with additional validation
const careerFormSchema = insertCareerSchema.extend({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  department: z.string().min(2, { message: "Department is required" }),
  location: z.string().min(2, { message: "Location is required" }),
  type: z.string().min(2, { message: "Job type is required" }),
  description: z.string().min(50, { message: "Description must be at least 50 characters" }),
  requirements: z.string().min(50, { message: "Requirements must be at least 50 characters" }),
  published: z.boolean().default(true),
});

type CareerFormValues = z.infer<typeof careerFormSchema>;

interface CareerFormProps {
  initialData?: Career | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CareerForm({ initialData, onClose, onSuccess }: CareerFormProps) {
  const { toast } = useToast();
  
  const form = useForm<CareerFormValues>({
    resolver: zodResolver(careerFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      department: initialData?.department || "",
      location: initialData?.location || "",
      type: initialData?.type || "",
      description: initialData?.description || "",
      requirements: initialData?.requirements || "",
      published: initialData?.published ?? true,
    },
  });

  // Create mutation
  const createCareerMutation = useMutation({
    mutationFn: async (data: CareerFormValues) => {
      const res = await apiRequest("POST", "/api/admin/careers", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Job posting created",
        description: "The job posting has been created successfully.",
      });
      if (onSuccess) onSuccess();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create job posting. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateCareerMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: CareerFormValues }) => {
      const res = await apiRequest("PUT", `/api/admin/careers/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Job posting updated",
        description: "The job posting has been updated successfully.",
      });
      if (onSuccess) onSuccess();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update job posting. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CareerFormValues) => {
    if (initialData) {
      updateCareerMutation.mutate({ id: initialData.id, data });
    } else {
      createCareerMutation.mutate(data);
    }
  };

  // Department options
  const departments = [
    "Engineering",
    "Design",
    "Product",
    "Marketing",
    "Sales",
    "Customer Support",
    "Operations",
    "Human Resources",
    "Finance",
  ];

  // Location options
  const locations = [
    "Remote",
    "San Francisco, CA",
    "New York, NY",
    "Seattle, WA",
    "Austin, TX",
    "Boston, MA",
    "London, UK",
    "Berlin, Germany",
    "Toronto, Canada",
  ];

  // Job type options
  const jobTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Internship",
    "Temporary",
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Senior Frontend Developer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departments.map((department) => (
                      <SelectItem key={department} value={department}>
                        {department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {jobTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the role, responsibilities, and what a typical day looks like..."
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Requirements</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="List the skills, qualifications, and experience required for this position..."
                  className="min-h-[150px]"
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
                  Set to published to make this job visible on the careers page
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
              createCareerMutation.isPending || updateCareerMutation.isPending
            }
          >
            {(createCareerMutation.isPending || updateCareerMutation.isPending) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {initialData ? "Update Job Posting" : "Create Job Posting"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
