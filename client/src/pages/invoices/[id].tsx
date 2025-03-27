import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Invoice, InvoiceItem, Payment } from '@shared/schema';
import { InvoiceStatusBadge } from '@/components/invoices/invoice-status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { apiRequest } from '@/lib/queryClient';
import { ArrowLeft, Calendar, FileClock, FileText, Tag, User } from 'lucide-react';
import { useParams, useLocation } from 'wouter';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function InvoiceDetailPage() {
  const { id } = useParams();
  const invoiceId = parseInt(id || '0');
  const [, navigate] = useLocation();
  const { user } = useAuth();
  
  // Fetch the invoice details
  const { data: invoice, isLoading: isLoadingInvoice } = useQuery<Invoice>({
    queryKey: ['/api/invoices', invoiceId],
    enabled: !!user && !!invoiceId
  });
  
  // Fetch invoice items
  const { data: invoiceItems, isLoading: isLoadingItems } = useQuery<InvoiceItem[]>({
    queryKey: ['/api/invoices', invoiceId, 'items'],
    enabled: !!user && !!invoiceId
  });
  
  // Fetch invoice payments
  const { data: payments, isLoading: isLoadingPayments } = useQuery<Payment[]>({
    queryKey: ['/api/invoices', invoiceId, 'payments'],
    enabled: !!user && !!invoiceId
  });
  
  const isLoading = isLoadingInvoice || isLoadingItems || isLoadingPayments;
  const totalAmountPaid = payments?.reduce((sum, payment) => sum + parseFloat(payment.amount), 0) || 0;
  const remainingAmount = invoice ? parseFloat(invoice.amount) - totalAmountPaid : 0;
  
  if (isLoading) {
    return <LoadingSkeleton />;
  }
  
  if (!invoice) {
    return (
      <div className="container py-6 space-y-6">
        <Alert variant="destructive">
          <AlertTitle>Invoice Not Found</AlertTitle>
          <AlertDescription>
            The invoice you're looking for doesn't exist or you don't have permission to view it.
          </AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => navigate('/invoices')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Invoices
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate('/invoices')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Invoice Details</h1>
        </div>
        <InvoiceStatusBadge status={invoice.status} className="px-3 py-1 text-sm" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Invoice Items</CardTitle>
              <CardDescription>Items included in this invoice</CardDescription>
            </CardHeader>
            <CardContent>
              {invoiceItems && invoiceItems.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50%]">Description</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoiceItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.description}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(parseFloat(item.unitPrice), invoice.currency)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(parseFloat(item.amount), invoice.currency)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3}>Total</TableCell>
                      <TableCell className="text-right font-bold">{formatCurrency(parseFloat(invoice.amount), invoice.currency)}</TableCell>
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
          
          {payments && payments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Payment History</CardTitle>
                <CardDescription>Recorded payments for this invoice</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                        <TableCell>{payment.paymentMethod}</TableCell>
                        <TableCell>{payment.transactionId || "—"}</TableCell>
                        <TableCell className="text-right">{formatCurrency(parseFloat(payment.amount), invoice.currency)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3}>Total Paid</TableCell>
                      <TableCell className="text-right">{formatCurrency(totalAmountPaid, invoice.currency)}</TableCell>
                    </TableRow>
                    {remainingAmount > 0 && (
                      <TableRow>
                        <TableCell colSpan={3}>Remaining</TableCell>
                        <TableCell className="text-right">{formatCurrency(remainingAmount, invoice.currency)}</TableCell>
                      </TableRow>
                    )}
                  </TableFooter>
                </Table>
              </CardContent>
            </Card>
          )}
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
          
          {invoice.status === 'pending' || invoice.status === 'unpaid' || invoice.status === 'overdue' ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Make a Payment</CardTitle>
                <CardDescription>Contact administrator to make a payment</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Please contact our finance department to make a payment for this invoice.
                  You can reach them via email at finance@softflow.com or call during business hours.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="default">
                  Contact Finance Department
                </Button>
              </CardFooter>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-10 w-64" />
        </div>
        <Skeleton className="h-8 w-24" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-16 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-full" />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}