'use client';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useApiQuery } from '@/lib/hooks/use-api-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';

const COLORS = ['hsl(262 83% 58%)', 'hsl(199 89% 48%)', 'hsl(38 92% 50%)', 'hsl(0 84% 60%)', 'hsl(160 84% 39%)', 'hsl(280 65% 60%)'];

interface RevenueReport {
  total: number;
  byMonth: { month: string; revenue: number }[];
  byMethod: { method: string; amount: number }[];
}

interface FeeCollectionReport {
  totalBilled: number;
  totalCollected: number;
  totalOutstanding: number;
  collectionRate: number;
  statusBreakdown: { status: string; count: number }[];
}

interface AdmissionsTrendReport {
  total: number;
  byMonth: { month: string; count: number }[];
  byStatus: { status: string; count: number }[];
}

interface LeadFunnelReport {
  funnel: { stage: string; count: number }[];
  total: number;
  enrolled: number;
  conversionRate: number;
}

function RevenueReportTab() {
  const { data } = useApiQuery<RevenueReport>(['reports', 'revenue'], '/reports/revenue');
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Revenue by Month (Total: {data ? formatCurrency(data.total) : '-'})</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.byMonth ?? []}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Bar dataKey="revenue" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Revenue by Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Method</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.byMethod.map((m) => (
                <TableRow key={m.method}>
                  <TableCell>{m.method.replace('_', ' ')}</TableCell>
                  <TableCell>{formatCurrency(m.amount)}</TableCell>
                </TableRow>
              ))}
              {!data?.byMethod.length && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground py-6">No data</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function FeeCollectionReportTab() {
  const { data } = useApiQuery<FeeCollectionReport>(['reports', 'fee-collection'], '/reports/fee-collection');
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total Billed</p><p className="text-xl font-bold">{data ? formatCurrency(data.totalBilled) : '-'}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total Collected</p><p className="text-xl font-bold">{data ? formatCurrency(data.totalCollected) : '-'}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Outstanding</p><p className="text-xl font-bold">{data ? formatCurrency(data.totalOutstanding) : '-'}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Collection Rate</p><p className="text-xl font-bold">{data ? `${data.collectionRate}%` : '-'}</p></CardContent></Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Invoice Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data?.statusBreakdown ?? []} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>
                  {(data?.statusBreakdown ?? []).map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.statusBreakdown.map((s) => (
                <TableRow key={s.status}>
                  <TableCell>{s.status.replace('_', ' ')}</TableCell>
                  <TableCell>{s.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function AdmissionsTrendReportTab() {
  const { data } = useApiQuery<AdmissionsTrendReport>(['reports', 'admissions-trend'], '/reports/admissions-trend');
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Admissions by Month (Total: {data?.total ?? '-'})</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data?.byMonth ?? []}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke={COLORS[0]} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">By Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.byStatus.map((s) => (
                <TableRow key={s.status}>
                  <TableCell>{s.status.replace('_', ' ')}</TableCell>
                  <TableCell>{s.count}</TableCell>
                </TableRow>
              ))}
              {!data?.byStatus.length && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground py-6">No data</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function LeadFunnelReportTab() {
  const { data } = useApiQuery<LeadFunnelReport>(['reports', 'lead-conversion-funnel'], '/reports/lead-conversion-funnel');
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total Leads</p><p className="text-xl font-bold">{data?.total ?? '-'}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Enrolled</p><p className="text-xl font-bold">{data?.enrolled ?? '-'}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Conversion Rate</p><p className="text-xl font-bold">{data ? `${data.conversionRate}%` : '-'}</p></CardContent></Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lead Conversion Funnel</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.funnel ?? []} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
              <YAxis dataKey="stage" type="category" tick={{ fontSize: 11 }} width={120} />
              <Tooltip />
              <Bar dataKey="count" fill={COLORS[0]} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stage</TableHead>
                <TableHead>Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.funnel.map((f) => (
                <TableRow key={f.stage}>
                  <TableCell>{f.stage.replace('_', ' ')}</TableCell>
                  <TableCell>{f.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="text-sm text-muted-foreground">Revenue, fee collection, admissions, and lead conversion insights.</p>
      </div>

      <Tabs defaultValue="revenue">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="fee-collection">Fee Collection</TabsTrigger>
          <TabsTrigger value="admissions-trend">Admissions Trend</TabsTrigger>
          <TabsTrigger value="lead-funnel">Lead Conversion Funnel</TabsTrigger>
        </TabsList>
        <TabsContent value="revenue">
          <RevenueReportTab />
        </TabsContent>
        <TabsContent value="fee-collection">
          <FeeCollectionReportTab />
        </TabsContent>
        <TabsContent value="admissions-trend">
          <AdmissionsTrendReportTab />
        </TabsContent>
        <TabsContent value="lead-funnel">
          <LeadFunnelReportTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
