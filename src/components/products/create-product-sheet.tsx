"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Plus, Loader2 } from "lucide-react";
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
import { createProduct } from "@/app/actions/product";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? "Creating..." : "Create Product"}
    </Button>
  );
}

export function CreateProductSheet() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  async function clientAction(formData: FormData) {
    setError("");
    const result = await createProduct(formData);
    
    if (result.success) {
      setOpen(false);
    } else {
      setError(result?.error || "An error occurred");
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="flex items-center justify-center h-10 px-4 py-2 bg-primary text-primary-foreground shadow hover:bg-primary/90 rounded-md text-sm font-medium">
        <Plus className="mr-2 h-4 w-4" />
        Add Product
      </SheetTrigger>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add New Product</SheetTitle>
          <SheetDescription>
            Create a new item in your inventory catalog.
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
              <Label htmlFor="name">Product Name *</Label>
              <Input id="name" name="name" required placeholder="e.g. Steel Frames" />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="sku">SKU / Code *</Label>
              <Input id="sku" name="sku" required placeholder="e.g. STL-FRM-01" />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" name="category" placeholder="e.g. Raw Materials" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="uom">Unit of Measure</Label>
                <Input id="uom" name="uom" defaultValue="Units" placeholder="Units, kg, m..." />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="reorderLevel">Reorder Level</Label>
                <Input id="reorderLevel" name="reorderLevel" type="number" min="0" defaultValue="0" />
              </div>
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
