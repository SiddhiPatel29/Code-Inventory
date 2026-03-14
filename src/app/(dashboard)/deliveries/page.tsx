import { ArrowUpFromLine } from 'lucide-react';
import { getDeliveries, getDeliveryFormOptions } from '@/app/actions/delivery';
import { DispatchDeliverySheet } from '@/components/deliveries/dispatch-delivery-sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default async function DeliveriesPage() {
  const [deliveriesRes, optionsRes] = await Promise.all([
    getDeliveries(),
    getDeliveryFormOptions()
  ]);

  const deliveries = deliveriesRes.success ? deliveriesRes.data ?? [] : [];
  const options = optionsRes.success ? optionsRes.data : { products: [], customers: [], internalLocations: [] };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Deliveries</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage outbound shipments and delivery logs to your customers.</p>
        </div>
        <DispatchDeliverySheet 
          products={options?.products || []} 
          customers={options?.customers || []} 
          internalLocations={options?.internalLocations || []} 
        />
      </div>

      {deliveries.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-12 min-h-[400px]">
          <div className="flex flex-col items-center gap-2 text-center">
            <ArrowUpFromLine className="h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="text-2xl font-bold tracking-tight">
              No deliveries found
            </h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              You haven&apos;t shipped out any goods yet. Dispatch a delivery to log outgoing stock.
            </p>
          </div>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveries.map((delivery) => (
                <TableRow key={delivery.id}>
                  <TableCell className="font-medium">{delivery.reference}</TableCell>
                  <TableCell>{new Date(delivery.date).toLocaleDateString()}</TableCell>
                  <TableCell>{delivery.product.name}</TableCell>
                  <TableCell>{delivery.sourceLocation.name}</TableCell>
                  <TableCell>{delivery.destinationLocation.name}</TableCell>
                  <TableCell className="text-right font-medium text-rose-600">
                    -{delivery.quantity}
                  </TableCell>
                  <TableCell>
                    <Badge variant={delivery.status === 'Done' ? 'default' : 'secondary'}>
                      {delivery.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
