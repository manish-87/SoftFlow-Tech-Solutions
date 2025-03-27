import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { insertPaymentSchema } from '@shared/schema';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Create a schema for the form
const paymentFormSchema = insertPaymentSchema.omit({ 
  id: true, 
  createdAt: true,
  invoiceId: true
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

type PaymentFormProps = {
  invoiceId: number;
  invoiceAmount: string;
  currency: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function PaymentForm({ invoiceId, invoiceAmount, currency, onSuccess, onCancel }: PaymentFormProps) {
  const { toast } = useToast();
  
  // Set up form with default values
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      amount: invoiceAmount,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'credit card',
      transactionId: '',
      notes: '',
    }
  });
  
  // Create payment mutation
  const paymentMutation = useMutation({
    mutationFn: async (data: PaymentFormValues) => {
      const res = await apiRequest('POST', `/api/admin/invoices/${invoiceId}/payments`, {
        ...data,
        invoiceId
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Payment recorded",
        description: "The payment has been successfully recorded.",
      });
      // Invalidate queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ['/api/invoices', invoiceId, 'payments'] });
      // Update invoice status to paid
      updateInvoiceStatus();
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Failed to record payment",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  });
  
  // Update invoice status to paid
  const updateInvoiceStatus = async () => {
    try {
      await apiRequest('PUT', `/api/admin/invoices/${invoiceId}/status`, {
        status: 'paid'
      });
      // Invalidate the invoice query to refresh the status
      queryClient.invalidateQueries({ queryKey: ['/api/invoices', invoiceId] });
    } catch (error) {
      console.error('Failed to update invoice status', error);
    }
  };
  
  const onSubmit = (data: PaymentFormValues) => {
    paymentMutation.mutate(data);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Amount ({currency})</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  {...field}
                  disabled={paymentMutation.isPending}
                />
              </FormControl>
              <FormDescription>
                The amount being paid (default is the full invoice amount)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="paymentDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    disabled={paymentMutation.isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Method</FormLabel>
                <Select
                  disabled={paymentMutation.isPending}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a payment method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="credit card">Credit Card</SelectItem>
                    <SelectItem value="bank transfer">Bank Transfer</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="transactionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction ID</FormLabel>
              <FormControl>
                <Input
                  placeholder="Transaction reference number (optional)"
                  {...field}
                  value={field.value || ''}
                  disabled={paymentMutation.isPending}
                />
              </FormControl>
              <FormDescription>
                Reference number for the transaction (if applicable)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional payment details (optional)"
                  {...field}
                  value={field.value || ''}
                  disabled={paymentMutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={paymentMutation.isPending}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={paymentMutation.isPending}
          >
            {paymentMutation.isPending ? "Recording Payment..." : "Record Payment"}
          </Button>
        </div>
      </form>
    </Form>
  );
}