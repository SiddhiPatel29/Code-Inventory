import { Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getProducts } from '@/app/actions/product';
import { CreateProductSheet } from '@/components/products/create-product-sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default async function ProductsPage() {
  const result = await getProducts();
  const products = result.success ? result.data ?? [] : [];

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Products Catalog</h1>
        <CreateProductSheet />
      </div>

      {products.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-12 min-h-[400px]">
          <div className="flex flex-col items-center gap-2 text-center">
            <Package className="h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="text-2xl font-bold tracking-tight">
              No products found
            </h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              Add products to your catalog to start tracking your inventory across multiple warehouses.
            </p>
            {/* The trigger needs to be isolated or used here; for empty state we rely on the header button for now */}
          </div>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>UoM</TableHead>
                <TableHead className="text-right">Reorder Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.sku}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>
                    {product.category ? (
                      <Badge variant="outline">{product.category.name}</Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">None</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{product.uom}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {product.reorderLevel}
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
