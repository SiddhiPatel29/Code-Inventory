"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Truck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createDelivery } from "@/app/actions/delivery";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? "Dispatching..." : "Dispatch Delivery"}
    </Button>
  );
}

export function DispatchDeliverySheet({ 
  products, 
  customers, 
  internalLocations 
}: { 
  products: any[]; 
  customers: any[]; 
  internalLocations: any[] 
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  async function clientAction(formData: FormData) {
    setError("");
    const result = await createDelivery(formData);
    
    if (result.success) {
      setOpen(false);
    } else {
      setError(result?.error || "An error occurred");
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="flex items-center justify-center h-10 px-4 py-2 bg-primary text-primary-foreground shadow hover:bg-primary/90 rounded-md text-sm font-medium">
        <Truck className="mr-2 h-4 w-4" />
        Dispatch Delivery
      </SheetTrigger>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Dispatch Outgoing Goods</SheetTitle>
          <SheetDescription>
            Log outbound shipments from an internal warehouse to a customer destination.
          </SheetDescription>
        </SheetHeader>
        
        <form action={clientAction} className="space-y-6 mt-6">
          {error && (
            <div className="p-3 text-sm text-rose-500 bg-rose-500/10 rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="productId">Product *</Label>
              <Select name="productId" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name} ({p.sku})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="sourceLocationId">Warehouse (From) *</Label>
              <Select name="sourceLocationId" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select dispatch warehouse" />
                </SelectTrigger>
                <SelectContent>
                  {internalLocations.map(l => (
                    <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="destinationLocationId">Customer (To) *</Label>
              <Select name="destinationLocationId" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                   {/* Fallback mock if customers array is empty since seed only created Vendor */}
                   {customers.length > 0 ? (
                     customers.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))
                   ) : (
                     <SelectItem value="no-customers-found" disabled>No external locations exist</SelectItem>
                   )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity Shipped *</Label>
              <Input id="quantity" name="quantity" type="number" required min="1" placeholder="e.g. 50" />
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <SubmitButton />
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
