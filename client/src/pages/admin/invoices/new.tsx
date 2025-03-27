import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Project, insertInvoiceSchema, Invoice, User } from '@shared/schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { ArrowLeft, Save, RefreshCw } from 'lucide-react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/components/admin/admin-layout';

// Extend the invoice schema for the form
const invoiceFormSchema = z.object({
  userId: z.string().min(1, "Client is required"),
  projectId: z.string().min(1, "Project is required"),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  currency: z.string().default("USD"),
  status: z.string().default("pending"),
  issueDate: z.string().min(1, "Issue date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  paymentDate: z.string().optional().nullable(),
  paymentReference: z.string().optional().nullable(),
  notes: z.string().optional(),
});

type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;

export default function NewInvoicePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [showPaymentDate, setShowPaymentDate] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
  // Fetch all users for the client dropdown
  const { data: users, isLoading: isLoadingUsers, error: usersError } = useQuery<User[]>({
    queryKey: ['/api/users'],
    enabled: !!user?.isAdmin,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Fetch projects for the selected user - must match the API endpoint URL format
  const { data: userProjects, isLoading: isLoadingUserProjects, error: userProjectsError } = useQuery<Project[]>({
    queryKey: [`/api/users/${selectedUserId}/projects`],
    enabled: !!selectedUserId && !!user?.isAdmin,
    retry: 2,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
  
  // Set up form with default values
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      userId: '',
      projectId: '',
      amount: 0,
      currency: 'USD',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      status: 'pending',
      paymentReference: '',
      notes: '',
      paymentDate: null,
    }
  });
  
  // Update selected user ID when form value changes
  useEffect(() => {
    const subscription = form.watch((values, { name }) => {
      if (name === 'userId' && values.userId !== selectedUserId) {
        // Fix type error by checking if userId is defined
        if (values.userId) {
          setSelectedUserId(values.userId);
          // Reset project selection when user changes
          form.setValue('projectId', '');
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, selectedUserId]);
  
  // Create invoice mutation
  const createInvoice = useMutation({
    mutationFn: async (data: InvoiceFormValues) => {
      // Convert numeric values to strings as expected by the server
      const res = await apiRequest('POST', `/api/projects/${data.projectId}/invoices`, {
        ...data,
        amount: data.amount.toString(), // Convert amount to string
        projectId: parseInt(data.projectId),
      });
      return res.json();
    },
    onSuccess: (data: Invoice) => {
      toast({
        title: "Invoice created",
        description: "The invoice has been successfully created.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/invoices'] });
      queryClient.invalidateQueries({ queryKey: ['/api/projects', data.projectId, 'invoices'] });
      navigate(`/admin/invoices/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Failed to create invoice",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  });
  
  // Update state when status changes 
  useEffect(() => {
    const subscription = form.watch((values, { name }) => {
      if (name === 'status') {
        const status = form.getValues('status');
        const needsPaymentInfo = status === 'paid' || status === 'partially_paid';
        setShowPaymentDate(needsPaymentInfo);
        
        // Reset payment date and reference when status doesn't need payment info
        if (!needsPaymentInfo) {
          form.setValue('paymentDate', null);
          form.setValue('paymentReference', null);
        } else if (!form.getValues('paymentDate')) {
          // Set default payment date to today when status requires payment info
          form.setValue('paymentDate', new Date().toISOString().split('T')[0]);
        }
      }
    });
    
    // Initialize payment date visibility based on current status
    const currentStatus = form.getValues('status');
    setShowPaymentDate(currentStatus === 'paid' || currentStatus === 'partially_paid');
    
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = (data: InvoiceFormValues) => {
    createInvoice.mutate(data);
  };
  
  const content = (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate('/admin/invoices')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Create New Invoice</h1>
        </div>
      </div>
      
      {usersError && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error loading clients</AlertTitle>
          <AlertDescription>
            We couldn't load the clients list. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      )}
      
      {userProjectsError && selectedUserId && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error loading projects</AlertTitle>
          <AlertDescription>
            We couldn't load the projects for this client. Please try selecting a different client or refresh the page.
          </AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
          <CardDescription>Create a new invoice for a client project</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Client Selection First */}
                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client</FormLabel>
                      <Select
                        disabled={isLoadingUsers || createInvoice.isPending}
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedUserId(value);
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a client" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isLoadingUsers ? (
                            <SelectItem value="loading" disabled>Loading clients...</SelectItem>
                          ) : users && Array.isArray(users) && users.length > 0 ? (
                            users.map((user: User) => (
                              <SelectItem key={user.id} value={user.id.toString()}>
                                {user.username} {user.isAdmin ? '(Admin)' : ''}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>No clients available</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the client for this invoice
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Project Selection (dependent on client) */}
                <FormField
                  control={form.control}
                  name="projectId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project</FormLabel>
                      <Select
                        disabled={!selectedUserId || isLoadingUserProjects || createInvoice.isPending}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={!selectedUserId ? "Select a client first" : "Select a project"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {!selectedUserId ? (
                            <SelectItem value="noclient" disabled>Please select a client first</SelectItem>
                          ) : isLoadingUserProjects ? (
                            <SelectItem value="loading" disabled>
                              <div className="flex items-center gap-2">
                                <RefreshCw className="h-4 w-4 animate-spin" />
                                <span>Loading projects...</span>
                              </div>
                            </SelectItem>
                          ) : userProjects && Array.isArray(userProjects) && userProjects.length > 0 ? (
                            userProjects.map((project: Project) => (
                              <SelectItem key={project.id} value={project.id.toString()}>
                                {/* Handle both title and name fields for consistency between project creation forms */}
                                {project.title || project.name || `Project #${project.id}`}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>No projects available for this client</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the project for this invoice
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        disabled={createInvoice.isPending}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="unpaid">Unpaid</SelectItem>
                          <SelectItem value="partially_paid">Partially Paid</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="overdue">Overdue</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Current status of the invoice
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="1000.00"
                          type="number"
                          inputMode="decimal"
                          step="0.01"
                          value={value}
                          onChange={(e) => onChange(e.target.valueAsNumber || 0)}
                          {...fieldProps}
                          disabled={createInvoice.isPending}
                        />
                      </FormControl>
                      <FormDescription>
                        The total amount for this invoice
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select
                        disabled={createInvoice.isPending}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USD">USD - US Dollar</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                          <SelectItem value="GBP">GBP - British Pound</SelectItem>
                          <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                          <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                          <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Currency for the invoice amount
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="issueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issue Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          disabled={createInvoice.isPending}
                        />
                      </FormControl>
                      <FormDescription>
                        Date when the invoice is issued
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          disabled={createInvoice.isPending}
                        />
                      </FormControl>
                      <FormDescription>
                        Date when the payment is due
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Show Payment Date and Reference fields when status is 'paid' or 'partially_paid' */}
                {(form.getValues('status') === 'paid' || form.getValues('status') === 'partially_paid') && (
                  <>
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
                              value={field.value || ''}
                              onChange={e => field.onChange(e.target.value || null)}
                              disabled={createInvoice.isPending}
                            />
                          </FormControl>
                          <FormDescription>
                            Date when payment was received
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="paymentReference"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Reference</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Transaction ID, check number, etc."
                              {...field}
                              value={field.value || ''}
                              onChange={e => field.onChange(e.target.value || null)}
                              disabled={createInvoice.isPending}
                            />
                          </FormControl>
                          <FormDescription>
                            Reference number for the payment
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any additional notes or payment instructions here..."
                        {...field}
                        disabled={createInvoice.isPending}
                      />
                    </FormControl>
                    <FormDescription>
                      Additional information for the client
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/invoices')}
                  disabled={createInvoice.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createInvoice.isPending}
                >
                  {createInvoice.isPending ? "Creating..." : "Create Invoice"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
  
  if (!user?.isAdmin) {
    return (
      <div className="container py-6">
        <Alert variant="destructive">
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You don't have permission to access this page. Please contact your administrator.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return <AdminLayout title="Create Invoice">{content}</AdminLayout>;
}