import { getDashboardStats } from '@/app/actions/dashboard';
import { Package, ArrowDownToLine, Truck, AlertCircle } from 'lucide-react';
import { KpiCard } from '@/components/dashboard/kpi-card';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { DashboardFilters } from '@/components/dashboard/filters';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function DashboardPage() {
  const statsRes = await getDashboardStats();
  const stats = statsRes.success && statsRes.data ? statsRes.data : {
    totalProducts: 0,
    lowStockCount: 0,
    pendingReceipts: 0,
    pendingDeliveries: 0,
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Overview of your inventory network</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/receipts">
            <Button>New Receipt</Button>
          </Link>
          <Link href="/deliveries">
            <Button variant="secondary">New Delivery</Button>
          </Link>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          description="Catalog total"
        />
        <KpiCard
          title="Low Stock Items"
          value={stats.lowStockCount}
          icon={AlertCircle}
          description="Below reorder levels"
        />
        <KpiCard
          title="Pending Receipts"
          value={stats.pendingReceipts}
          icon={ArrowDownToLine}
          description="Inbound items"
        />
        <KpiCard
          title="Pending Deliveries"
          value={stats.pendingDeliveries}
          icon={Truck}
          description="Outbound ship"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 lg:col-span-5">
          <CardHeader>
            <CardTitle>Recent Operations</CardTitle>
            <CardDescription>
              A summary of the last 5 inventory movements in the system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardFilters />
            <RecentActivity />
          </CardContent>
        </Card>
        
        <Card className="col-span-4 md:col-span-2 lg:col-span-2">
          <CardHeader>
            <CardTitle>Inventory Health</CardTitle>
            <CardDescription>Status breakdown</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-[200px] text-muted-foreground text-sm">
            [Health Chart Placeholder]
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
