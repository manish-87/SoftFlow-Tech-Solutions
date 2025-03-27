import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Invoice, InvoiceItem, Payment, Project } from '@shared/schema';
import { InvoiceStatusBadge } from '@/components/invoices/invoice-status-badge';
import { InvoiceItemForm } from '@/components/invoices/invoice-item-form';
import { PaymentForm } from '@/components/invoices/payment-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useParams, useLocation } from 'wouter';
import { ArrowLeft, Calendar, DollarSign, FilePlus, FileClock, FileText, Pencil, PlusCircle, Trash2, Printer, Download, Send } from 'lucide-react';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AdminLayout } from '@/components/admin/admin-layout';

export default function AdminInvoiceDetailPage() {
  const { id } = useParams();
  const invoiceId = parseInt(id || '0');
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [showAddItem, setShowAddItem] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [statusChangeOpen, setStatusChangeOpen] = useState(false);
  
  // Fetch the invoice details
  const { data: invoice, isLoading: isLoadingInvoice } = useQuery<Invoice>({
    queryKey: ['/api/invoices', invoiceId],
    enabled: !!user?.isAdmin && !!invoiceId
  });
  
  // Fetch invoice items
  const { data: invoiceItems, isLoading: isLoadingItems } = useQuery<InvoiceItem[]>({
    queryKey: ['/api/invoices', invoiceId, 'items'],
    enabled: !!user?.isAdmin && !!invoiceId
  });
  
  // Fetch invoice payments
  const { data: payments, isLoading: isLoadingPayments } = useQuery<Payment[]>({
    queryKey: ['/api/invoices', invoiceId, 'payments'],
    enabled: !!user?.isAdmin && !!invoiceId
  });
  
  // Fetch project details
  const { data: project } = useQuery<Project>({
    queryKey: ['/api/admin/projects', invoice?.projectId],
    enabled: !!user?.isAdmin && !!invoice?.projectId
  });
  
  // Update invoice status mutation
  const updateStatus = useMutation({
    mutationFn: async (status: string) => {
      const res = await apiRequest('PUT', `/api/admin/invoices/${invoiceId}/status`, { status });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Status updated",
        description: "The invoice status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/invoices', invoiceId] });
      setStatusChangeOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to update status",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  });
  
  // Delete invoice item mutation
  const deleteItem = useMutation({
    mutationFn: async (itemId: number) => {
      await apiRequest('DELETE', `/api/admin/invoice-items/${itemId}`);
    },
    onSuccess: () => {
      toast({
        title: "Item deleted",
        description: "The invoice item has been removed.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/invoices', invoiceId, 'items'] });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete item",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  });
  
  // Delete payment mutation
  const deletePayment = useMutation({
    mutationFn: async (paymentId: number) => {
      await apiRequest('DELETE', `/api/admin/payments/${paymentId}`);
    },
    onSuccess: () => {
      toast({
        title: "Payment deleted",
        description: "The payment record has been removed.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/invoices', invoiceId, 'payments'] });
      // Check if all payments are deleted, update status to unpaid
      if (payments?.length === 1) {
        updateStatus.mutate('unpaid');
      }
    },
    onError: (error) => {
      toast({
        title: "Failed to delete payment",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  });
  
  const isLoading = isLoadingInvoice || isLoadingItems || isLoadingPayments;
  const totalAmountPaid = payments?.reduce((sum, payment) => sum + parseFloat(payment.amount), 0) || 0;
  const remainingAmount = invoice ? parseFloat(invoice.amount) - totalAmountPaid : 0;
  
  // Function to handle printing
  const handlePrint = () => {
    window.print();
  };
  
  const content = (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : !invoice ? (
        <Alert variant="destructive">
          <AlertTitle>Invoice Not Found</AlertTitle>
          <AlertDescription>
            The invoice you're looking for doesn't exist or you don't have permission to view it.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => navigate('/admin/invoices')}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-3xl font-bold tracking-tight">Invoice {invoice.invoiceNumber}</h1>
            </div>
            <div className="flex items-center gap-2">
              <InvoiceStatusBadge status={invoice.status} className="px-3 py-1 text-sm" />
              <Button variant="outline" size="sm" onClick={() => setStatusChangeOpen(true)}>
                Change Status
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle className="text-xl">Invoice Items</CardTitle>
                    <CardDescription>Services or products included in this invoice</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setShowAddItem(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </CardHeader>
                <CardContent>
                  {invoiceItems && invoiceItems.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[40%]">Description</TableHead>
                          <TableHead className="text-right">Quantity</TableHead>
                          <TableHead className="text-right">Unit Price</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="text-right w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invoiceItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.description}</TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-right">{formatCurrency(parseFloat(item.unitPrice), invoice.currency)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(parseFloat(item.amount), invoice.currency)}</TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => window.confirm('Are you sure you want to delete this item?') && deleteItem.mutate(item.id)}
                                disabled={deleteItem.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell colSpan={3}>Total</TableCell>
                          <TableCell className="text-right font-bold">{formatCurrency(parseFloat(invoice.amount), invoice.currency)}</TableCell>
                          <TableCell />
                        </TableRow>
                      </TableFooter>
                    </Table>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      No items found for this invoice
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle className="text-xl">Payment History</CardTitle>
                    <CardDescription>Recorded payments for this invoice</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowAddPayment(true)}
                    disabled={invoice.status === 'paid' && remainingAmount <= 0}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Record Payment
                  </Button>
                </CardHeader>
                <CardContent>
                  {payments && payments.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Method</TableHead>
                          <TableHead>Transaction ID</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="text-right w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                            <TableCell>{payment.paymentMethod}</TableCell>
                            <TableCell>{payment.transactionId || "—"}</TableCell>
                            <TableCell className="text-right">{formatCurrency(parseFloat(payment.amount), invoice.currency)}</TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => window.confirm('Are you sure you want to delete this payment record?') && deletePayment.mutate(payment.id)}
                                disabled={deletePayment.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell colSpan={3}>Total Paid</TableCell>
                          <TableCell className="text-right">{formatCurrency(totalAmountPaid, invoice.currency)}</TableCell>
                          <TableCell />
                        </TableRow>
                        {remainingAmount > 0 && (
                          <TableRow>
                            <TableCell colSpan={3}>Remaining</TableCell>
                            <TableCell className="text-right">{formatCurrency(remainingAmount, invoice.currency)}</TableCell>
                            <TableCell />
                          </TableRow>
                        )}
                      </TableFooter>
                    </Table>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      No payments recorded for this invoice
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Invoice Summary</CardTitle>
                  <CardDescription>Key information about this invoice</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Invoice Number</div>
                    <div className="font-medium">{invoice.invoiceNumber}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Project</div>
                    <div className="font-medium">{project?.name || `Project #${invoice.projectId}`}</div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Issue Date</div>
                    <div className="font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {formatDate(invoice.issueDate)}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Due Date</div>
                    <div className="font-medium flex items-center gap-2">
                      <FileClock className="h-4 w-4 text-muted-foreground" />
                      {formatDate(invoice.dueDate)}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Total Amount</div>
                    <div className="text-xl font-bold">{formatCurrency(parseFloat(invoice.amount), invoice.currency)}</div>
                  </div>
                  
                  {payments && payments.length > 0 && (
                    <>
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Amount Paid</div>
                        <div className="font-medium text-green-600">{formatCurrency(totalAmountPaid, invoice.currency)}</div>
                      </div>
                      
                      {remainingAmount > 0 && (
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">Remaining Balance</div>
                          <div className="font-medium text-amber-600">{formatCurrency(remainingAmount, invoice.currency)}</div>
                        </div>
                      )}
                    </>
                  )}
                  
                  {invoice.notes && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Notes</div>
                        <div className="font-medium">{invoice.notes}</div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Actions</CardTitle>
                  <CardDescription>Manage this invoice</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full justify-start" variant="outline" onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print Invoice
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => toast({ title: "Feature coming soon", description: "PDF download will be available in a future update." })}>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => toast({ title: "Feature coming soon", description: "Email functionality will be available in a future update." })}>
                    <Send className="mr-2 h-4 w-4" />
                    Email to Client
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => navigate(`/admin/invoices/${invoiceId}/edit`)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Invoice
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Add Item Dialog */}
          <Dialog open={showAddItem} onOpenChange={setShowAddItem}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Invoice Item</DialogTitle>
                <DialogDescription>
                  Add a new item to invoice {invoice.invoiceNumber}
                </DialogDescription>
              </DialogHeader>
              <InvoiceItemForm 
                invoiceId={invoiceId} 
                onSuccess={() => setShowAddItem(false)} 
                onCancel={() => setShowAddItem(false)} 
              />
            </DialogContent>
          </Dialog>
          
          {/* Add Payment Dialog */}
          <Dialog open={showAddPayment} onOpenChange={setShowAddPayment}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Payment</DialogTitle>
                <DialogDescription>
                  Record a new payment for invoice {invoice.invoiceNumber}
                </DialogDescription>
              </DialogHeader>
              <PaymentForm 
                invoiceId={invoiceId}
                invoiceAmount={remainingAmount.toFixed(2)}
                currency={invoice.currency}
                onSuccess={() => setShowAddPayment(false)}
                onCancel={() => setShowAddPayment(false)}
              />
            </DialogContent>
          </Dialog>
          
          {/* Change Status Dialog */}
          <Dialog open={statusChangeOpen} onOpenChange={setStatusChangeOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Change Invoice Status</DialogTitle>
                <DialogDescription>
                  Update the status of invoice {invoice.invoiceNumber}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Select 
                  defaultValue={invoice.status}
                  onValueChange={(value) => updateStatus.mutate(value)}
                  disabled={updateStatus.isPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setStatusChangeOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => setStatusChangeOpen(false)}
                  disabled={updateStatus.isPending}
                >
                  Save Status
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
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
  
  return <AdminLayout>{content}</AdminLayout>;
}