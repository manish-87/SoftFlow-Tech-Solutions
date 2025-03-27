import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { insertInvoiceItemSchema, InvoiceItem } from '@shared/schema';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Create a schema for the form
const invoiceItemFormSchema = insertInvoiceItemSchema.omit({ 
  id: true, 
  createdAt: true,
  invoiceId: true,
  amount: true
}).extend({
  quantity: z.string().min(1, 'Quantity is required'),
  unitPrice: z.string().min(1, 'Unit price is required'),
  taxRate: z.string().optional(),
  taxAmount: z.string().optional(),
});

type InvoiceItemFormValues = z.infer<typeof invoiceItemFormSchema>;

type InvoiceItemFormProps = {
  invoiceId: number;
  item?: InvoiceItem;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function InvoiceItemForm({ invoiceId, item, onSuccess, onCancel }: InvoiceItemFormProps) {
  const { toast } = useToast();
  
  // Set up form with default values
  const form = useForm<InvoiceItemFormValues>({
    resolver: zodResolver(invoiceItemFormSchema),
    defaultValues: {
      description: item?.description || '',
      quantity: item?.quantity || '1',
      unitPrice: item?.unitPrice || '',
      taxRate: item?.taxRate || '',
      taxAmount: item?.taxAmount || '',
    }
  });
  
  // Watch quantity and unitPrice to calculate amount
  const quantity = form.watch('quantity');
  const unitPrice = form.watch('unitPrice');
  const taxRate = form.watch('taxRate');
  
  // Calculate amount whenever quantity or unitPrice changes
  useEffect(() => {
    const qty = parseFloat(quantity) || 0;
    const price = parseFloat(unitPrice) || 0;
    const rate = parseFloat(taxRate) || 0;
    
    const subtotal = qty * price;
    const taxAmount = (subtotal * rate) / 100;
    
    if (!isNaN(taxAmount) && taxAmount > 0) {
      form.setValue('taxAmount', taxAmount.toFixed(2));
    }
  }, [quantity, unitPrice, taxRate, form]);
  
  // Create or update invoice item mutation
  const itemMutation = useMutation({
    mutationFn: async (data: InvoiceItemFormValues) => {
      // Calculate the amount based on quantity and unit price
      const qty = parseFloat(data.quantity) || 0;
      const price = parseFloat(data.unitPrice) || 0;
      const subtotal = qty * price;
      
      let endpoint = `/api/admin/invoices/${invoiceId}/items`;
      let method = 'POST';
      
      // If we're updating an existing item
      if (item) {
        endpoint = `/api/admin/invoice-items/${item.id}`;
        method = 'PUT';
      }
      
      const res = await apiRequest(method, endpoint, {
        ...data,
        amount: subtotal.toFixed(2),
        invoiceId: invoiceId
      });
      
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: item ? "Item updated" : "Item added",
        description: item ? "The invoice item has been updated." : "The item has been added to the invoice.",
      });
      // Invalidate queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ['/api/invoices', invoiceId, 'items'] });
      if (onSuccess) onSuccess();
      form.reset();
    },
    onError: (error) => {
      toast({
        title: item ? "Failed to update item" : "Failed to add item",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  });
  
  const onSubmit = (data: InvoiceItemFormValues) => {
    itemMutation.mutate(data);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter item description"
                  {...field}
                  disabled={itemMutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="1"
                    {...field}
                    disabled={itemMutation.isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="unitPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit Price</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    {...field}
                    disabled={itemMutation.isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="taxRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax Rate (%)</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    {...field}
                    value={field.value || ''}
                    disabled={itemMutation.isPending}
                  />
                </FormControl>
                <FormDescription>Optional tax rate percentage</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="taxAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax Amount</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    {...field}
                    value={field.value || ''}
                    disabled={true}
                  />
                </FormControl>
                <FormDescription>Automatically calculated</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={itemMutation.isPending}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={itemMutation.isPending}
          >
            {itemMutation.isPending ? (item ? "Updating..." : "Adding...") : (item ? "Update Item" : "Add Item")}
          </Button>
        </div>
      </form>
    </Form>
  );
}