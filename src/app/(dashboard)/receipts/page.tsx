import { ArrowDownToLine } from 'lucide-react';
import { getReceipts, getReceiptFormOptions } from '@/app/actions/receipt';
import { ReceiveStockSheet } from '@/components/receipts/receive-stock-sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default async function ReceiptsPage() {
  const [receiptsRes, optionsRes] = await Promise.all([
    getReceipts(),
    getReceiptFormOptions()
  ]);

  const receipts = receiptsRes.success ? receiptsRes.data ?? [] : [];
  const options = optionsRes.success ? optionsRes.data : { products: [], vendors: [], internalLocations: [] };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Receipts</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage incoming stock from your vendors into your warehouses.</p>
        </div>
        <ReceiveStockSheet 
          products={options?.products || []} 
          vendors={options?.vendors || []} 
          internalLocations={options?.internalLocations || []} 
        />
      </div>

      {receipts.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-12 min-h-[400px]">
          <div className="flex flex-col items-center gap-2 text-center">
            <ArrowDownToLine className="h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="text-2xl font-bold tracking-tight">
              No receipts found
            </h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              You haven&apos;t received any stock yet. Record a new receipt to track incoming goods.
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
                <TableHead>Vendor</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receipts.map((receipt) => (
                <TableRow key={receipt.id}>
                  <TableCell className="font-medium">{receipt.reference}</TableCell>
                  <TableCell>{new Date(receipt.date).toLocaleDateString()}</TableCell>
                  <TableCell>{receipt.product.name}</TableCell>
                  <TableCell>{receipt.sourceLocation.name}</TableCell>
                  <TableCell>{receipt.destinationLocation.name}</TableCell>
                  <TableCell className="text-right font-medium text-emerald-600">
                    +{receipt.quantity}
                  </TableCell>
                  <TableCell>
                    <Badge variant={receipt.status === 'Done' ? 'default' : 'secondary'}>
                      {receipt.status}
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
