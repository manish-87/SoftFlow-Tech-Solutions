import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Partner, insertPartnerSchema } from "@shared/schema";
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
import { Loader2 } from "lucide-react";

// Extend the schema with additional validation
const partnerFormSchema = insertPartnerSchema.extend({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  logo: z.string().url({ message: "Please enter a valid logo URL" }),
  website: z.string().url({ message: "Please enter a valid website URL" }).optional().or(z.literal("")),
});

type PartnerFormValues = z.infer<typeof partnerFormSchema>;

interface PartnerFormProps {
  initialData?: Partner | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function PartnerForm({ initialData, onClose, onSuccess }: PartnerFormProps) {
  const { toast } = useToast();
  
  const form = useForm<PartnerFormValues>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      logo: initialData?.logo || "",
      website: initialData?.website || "",
    },
  });

  // Create mutation
  const createPartnerMutation = useMutation({
    mutationFn: async (data: PartnerFormValues) => {
      const res = await apiRequest("POST", "/api/admin/partners", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Partner added",
        description: "The partner has been added successfully.",
      });
      if (onSuccess) onSuccess();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add partner. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updatePartnerMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: PartnerFormValues }) => {
      const res = await apiRequest("PUT", `/api/admin/partners/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Partner updated",
        description: "The partner has been updated successfully.",
      });
      if (onSuccess) onSuccess();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update partner. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PartnerFormValues) => {
    if (initialData) {
      updatePartnerMutation.mutate({ id: initialData.id, data });
    } else {
      createPartnerMutation.mutate(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter company name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/logo.svg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website URL (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Preview */}
        {form.watch("logo") && (
          <div className="border rounded-md p-4">
            <p className="text-sm text-muted-foreground mb-2">Logo Preview</p>
            <div className="h-20 bg-neutral-100 flex items-center justify-center rounded-md">
              <img 
                src={form.watch("logo")} 
                alt="Logo preview" 
                className="max-h-16 max-w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  toast({
                    title: "Invalid image URL",
                    description: "The image could not be loaded. Please check the URL.",
                    variant: "destructive",
                  });
                }}
              />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              createPartnerMutation.isPending || updatePartnerMutation.isPending
            }
          >
            {(createPartnerMutation.isPending || updatePartnerMutation.isPending) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {initialData ? "Update Partner" : "Add Partner"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
