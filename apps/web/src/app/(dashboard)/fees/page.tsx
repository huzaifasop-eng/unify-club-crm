'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { usePaginatedList, ListSearchBar, Pagination } from '@/components/shared/paginated-list';
import { useApiQuery } from '@/lib/hooks/use-api-query';
import { InvoiceFormDialog } from '@/components/fees/invoice-form-dialog';
import { RecordPaymentDialog } from '@/components/fees/record-payment-dialog';
import { FeeStructureFormDialog } from '@/components/fees/fee-structure-form-dialog';
import { FeeStructure, Invoice, InvoiceStatus } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';

const STATUS_VARIANT: Record<InvoiceStatus, BadgeProps['variant']> = {
  DRAFT: 'outline',
  ISSUED: 'secondary',
  PARTIALLY_PAID: 'warning',
  PAID: 'success',
  OVERDUE: 'destructive',
  CANCELLED: 'outline',
};

function InvoicesTab() {
  const [formOpen, setFormOpen] = useState(false);
  const [payInvoice, setPayInvoice] = useState<Invoice | null>(null);

  const { data, isLoading, page, setPage, search, setSearch } = usePaginatedList<Invoice>('invoices', '/fees/invoices');

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ListSearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search invoices..." />
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4" /> New Invoice
        </Button>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Child</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                <TableCell>{invoice.child ? `${invoice.child.firstName} ${invoice.child.lastName}` : '-'}</TableCell>
                <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                <TableCell>{formatCurrency(invoice.total)}</TableCell>
                <TableCell>{formatCurrency(invoice.amountPaid)}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[invoice.status]}>{invoice.status.replace('_', ' ')}</Badge>
                </TableCell>
                <TableCell>
                  {invoice.status !== 'PAID' && invoice.status !== 'CANCELLED' && (
                    <Button variant="outline" size="sm" onClick={() => setPayInvoice(invoice)}>
                      Record Payment
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && data?.data.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No invoices found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {data?.meta && (
        <Pagination page={page} totalPages={data.meta.totalPages} total={data.meta.total} onPageChange={setPage} />
      )}

      <InvoiceFormDialog open={formOpen} onOpenChange={setFormOpen} />
      <RecordPaymentDialog open={!!payInvoice} onOpenChange={(o) => !o && setPayInvoice(null)} invoice={payInvoice} />
    </div>
  );
}

function FeeStructuresTab() {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<FeeStructure | null>(null);
  const { data: structures, isLoading } = useApiQuery<FeeStructure[]>(['fee-structures'], '/fees/fee-structures');

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(fs: FeeStructure) {
    setEditing(fs);
    setFormOpen(true);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> New Fee Structure
        </Button>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {structures?.map((fs) => (
              <TableRow key={fs.id} onClick={() => openEdit(fs)} className="cursor-pointer">
                <TableCell className="font-medium">{fs.name}</TableCell>
                <TableCell>{fs.description || '-'}</TableCell>
                <TableCell>{formatCurrency(fs.amount)}</TableCell>
                <TableCell>{fs.frequency}</TableCell>
                <TableCell>
                  <Badge variant={fs.isActive ? 'success' : 'outline'}>{fs.isActive ? 'Active' : 'Inactive'}</Badge>
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && structures?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No fee structures found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <FeeStructureFormDialog open={formOpen} onOpenChange={setFormOpen} feeStructure={editing} />
    </div>
  );
}

export default function FeesPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Fees & Invoicing</h1>
        <p className="text-sm text-muted-foreground">Manage invoices, payments, and fee structures.</p>
      </div>

      <Tabs defaultValue="invoices">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="structures">Fee Structures</TabsTrigger>
        </TabsList>
        <TabsContent value="invoices">
          <InvoicesTab />
        </TabsContent>
        <TabsContent value="structures">
          <FeeStructuresTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
