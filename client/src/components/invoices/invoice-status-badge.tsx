import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type InvoiceStatusBadgeProps = {
  status: string;
  className?: string;
}

export function InvoiceStatusBadge({ status, className }: InvoiceStatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status.toLowerCase()) {
      case 'paid':
        return {
          variant: 'success' as const,
          label: 'Paid',
          icon: 'check-circle'
        };
      case 'unpaid':
        return {
          variant: 'destructive' as const,
          label: 'Unpaid',
          icon: 'alert-circle'
        };
      case 'pending':
        return {
          variant: 'warning' as const,
          label: 'Pending',
          icon: 'clock'
        };
      case 'overdue':
        return {
          variant: 'destructive' as const,
          label: 'Overdue',
          icon: 'alert-triangle'
        };
      case 'cancelled':
        return {
          variant: 'outline' as const,
          label: 'Cancelled',
          icon: 'x-circle'
        };
      default:
        return {
          variant: 'secondary' as const,
          label: status,
          icon: 'help-circle'
        };
    }
  };

  const config = getStatusConfig();
  
  return (
    <Badge 
      variant={config.variant} 
      className={cn(
        "font-medium",
        config.variant === 'success' && "bg-green-100 text-green-800 hover:bg-green-200",
        config.variant === 'destructive' && "bg-red-100 text-red-800 hover:bg-red-200", 
        config.variant === 'warning' && "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        config.variant === 'outline' && "bg-gray-100 text-gray-800 hover:bg-gray-200",
        className
      )}
    >
      {config.label}
    </Badge>
  );
}