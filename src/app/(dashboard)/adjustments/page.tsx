import { SlidersHorizontal } from 'lucide-react';
import { getAdjustments, getAdjustmentFormOptions } from '@/app/actions/adjustment';
import { RecordAdjustmentSheet } from '@/components/adjustments/record-adjustment-sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default async function AdjustmentsPage() {
  const [adjustmentsRes, optionsRes] = await Promise.all([
    getAdjustments(),
    getAdjustmentFormOptions()
  ]);

  const adjustments = adjustmentsRes.success ? adjustmentsRes.data ?? [] : [];
  const options = optionsRes.success ? optionsRes.data : { products: [], internalLocations: [] };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Adjustments</h1>
          <p className="text-sm text-muted-foreground mt-1">Log broken goods, missing units, or found inventory variations.</p>
        </div>
        <RecordAdjustmentSheet 
          products={options?.products || []} 
          internalLocations={options?.internalLocations || []} 
        />
      </div>

      {adjustments.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-12 min-h-[400px]">
          <div className="flex flex-col items-center gap-2 text-center">
            <SlidersHorizontal className="h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="text-2xl font-bold tracking-tight">
              No adjustments found
            </h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              Your inventory count is accurate. Record an adjustment when goods are lost, damaged, or suddenly found.
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
                <TableHead>Location Involved</TableHead>
                <TableHead className="text-right">Quantity Delta</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adjustments.map((adjustment) => {
                // Determine if this is an Addition or Subtraction from our perspective (the Internal warehouse)
                const isAddition = adjustment.sourceLocation.type === 'Loss/Adjustment';
                const relatedLocation = isAddition ? adjustment.destinationLocation : adjustment.sourceLocation;

                return (
                  <TableRow key={adjustment.id}>
                    <TableCell className="font-medium">{adjustment.reference}</TableCell>
                    <TableCell>{new Date(adjustment.date).toLocaleDateString()}</TableCell>
                    <TableCell>{adjustment.product.name}</TableCell>
                    <TableCell>{relatedLocation.name}</TableCell>
                    <TableCell className={`text-right font-medium ${isAddition ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {isAddition ? '+' : '-'}{adjustment.quantity}
                    </TableCell>
                    <TableCell>
                      <Badge variant={adjustment.status === 'Done' ? 'default' : 'secondary'}>
                        {adjustment.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
