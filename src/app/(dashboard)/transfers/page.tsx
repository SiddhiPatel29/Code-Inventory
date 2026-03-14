import { ArrowLeftRight } from 'lucide-react';
import { getTransfers, getTransferFormOptions } from '@/app/actions/transfer';
import { TransferStockSheet } from '@/components/transfers/transfer-stock-sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default async function TransfersPage() {
  const [transfersRes, optionsRes] = await Promise.all([
    getTransfers(),
    getTransferFormOptions()
  ]);

  const transfers = transfersRes.success ? transfersRes.data ?? [] : [];
  const options = optionsRes.success ? optionsRes.data : { products: [], internalLocations: [] };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Internal Transfers</h1>
          <p className="text-sm text-muted-foreground mt-1">Move inventory between your internal warehouse locations.</p>
        </div>
        <TransferStockSheet 
          products={options?.products || []} 
          internalLocations={options?.internalLocations || []} 
        />
      </div>

      {transfers.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-12 min-h-[400px]">
          <div className="flex flex-col items-center gap-2 text-center">
            <ArrowLeftRight className="h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="text-2xl font-bold tracking-tight">
              No transfers found
            </h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              You haven't moved any goods internally. Initiate a new transfer to shift stock between warehouses.
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
                <TableHead>From Location</TableHead>
                <TableHead>To Location</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transfers.map((transfer) => (
                <TableRow key={transfer.id}>
                  <TableCell className="font-medium">{transfer.reference}</TableCell>
                  <TableCell>{new Date(transfer.date).toLocaleDateString()}</TableCell>
                  <TableCell>{transfer.product.name}</TableCell>
                  <TableCell>{transfer.sourceLocation.name}</TableCell>
                  <TableCell>{transfer.destinationLocation.name}</TableCell>
                  <TableCell className="text-right font-medium text-amber-600">
                    {transfer.quantity}
                  </TableCell>
                  <TableCell>
                    <Badge variant={transfer.status === 'Done' ? 'default' : 'secondary'}>
                      {transfer.status}
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
