import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Project, Invoice } from '@shared/schema';
import { InvoiceCard, InvoiceCardSkeleton } from '@/components/invoices/invoice-card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { apiRequest } from '@/lib/queryClient';

export default function InvoicesPage() {
  const { user } = useAuth();
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Fetch user's projects
  const { data: projects, isLoading: isLoadingProjects } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
    enabled: !!user
  });
  
  // Fetch invoices for the selected project or all projects
  const { data: invoices, isLoading: isLoadingInvoices } = useQuery<Invoice[]>({
    queryKey: ['/api/projects', selectedProject, 'invoices'],
    queryFn: async () => {
      if (selectedProject === 'all') {
        // Fetch all invoices by fetching from each project
        if (!projects?.length) return [];
        const allInvoices = await Promise.all(
          projects.map(async (project) => {
            const res = await apiRequest('GET', `/api/projects/${project.id}/invoices`);
            return res.json();
          })
        );
        return allInvoices.flat();
      } else {
        const res = await apiRequest('GET', `/api/projects/${selectedProject}/invoices`);
        return res.json();
      }
    },
    enabled: !!user && (selectedProject === 'all' ? !!projects : !!selectedProject)
  });
  
  // Filter invoices
  const filteredInvoices = invoices?.filter(invoice => {
    const matchesSearch = searchTerm === '' || 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      invoice.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });
  
  const isLoading = isLoadingProjects || isLoadingInvoices;
  
  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">Manage and view all your project invoices</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Filter Invoices</CardTitle>
            <CardDescription>Narrow down your invoice list</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Project</label>
              <Select 
                value={selectedProject} 
                onValueChange={setSelectedProject}
                disabled={isLoadingProjects}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects?.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select 
                value={statusFilter} 
                onValueChange={setStatusFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search invoice number..." 
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setSelectedProject('all');
              }}
            >
              Reset Filters
            </Button>
          </CardContent>
        </Card>
        
        <div className="col-span-1 md:col-span-2 space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <InvoiceCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredInvoices?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredInvoices.map((invoice) => (
                <InvoiceCard key={invoice.id} invoice={invoice} />
              ))}
            </div>
          ) : (
            <Alert>
              <AlertTitle>No invoices found</AlertTitle>
              <AlertDescription>
                {searchTerm || statusFilter !== 'all' ? 
                  "No invoices match your search criteria. Try adjusting your filters." : 
                  "There are no invoices associated with your account yet."}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}