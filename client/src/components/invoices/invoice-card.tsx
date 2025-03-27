import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InvoiceStatusBadge } from './invoice-status-badge';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Invoice } from '@shared/schema';
import { useLocation } from 'wouter';
import { ArrowRight, Calendar, DollarSign, FileText } from 'lucide-react';

type InvoiceCardProps = {
  invoice: Invoice;
  showActions?: boolean;
}

export function InvoiceCard({ invoice, showActions = true }: InvoiceCardProps) {
  const [, navigate] = useLocation();
  
  const handleClick = () => {
    navigate(`/invoices/${invoice.id}`);
  };
  
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold">{invoice.invoiceNumber}</CardTitle>
          <InvoiceStatusBadge status={invoice.status} />
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span>Amount: <span className="font-medium text-foreground">{formatCurrency(parseFloat(invoice.amount), invoice.currency)}</span></span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Issue Date: <span className="font-medium text-foreground">{formatDate(invoice.issueDate)}</span></span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Due Date: <span className="font-medium text-foreground">{formatDate(invoice.dueDate)}</span></span>
          </div>
          {invoice.notes && (
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4 mt-0.5" />
              <span>Notes: <span className="font-medium text-foreground">{invoice.notes}</span></span>
            </div>
          )}
        </div>
      </CardContent>
      {showActions && (
        <CardFooter className="pt-2">
          <Button variant="ghost" className="w-full justify-between group" onClick={handleClick}>
            <span>View Details</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

export function InvoiceCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="h-6 w-24 bg-muted rounded animate-pulse" />
          <div className="h-6 w-16 bg-muted rounded animate-pulse" />
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-muted rounded animate-pulse" />
            <div className="h-4 w-36 bg-muted rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-muted rounded animate-pulse" />
            <div className="h-4 w-40 bg-muted rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-muted rounded animate-pulse" />
            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="h-9 w-full bg-muted rounded animate-pulse" />
      </CardFooter>
    </Card>
  );
}