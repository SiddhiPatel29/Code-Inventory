"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAdjustmentFormOptions() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { name: 'asc' }
    });
    
    // Internal locations where actual stock sits
    const internalLocations = await prisma.location.findMany({
      where: { type: 'Internal' },
      orderBy: { name: 'asc' }
    });

    return { success: true, data: { products, internalLocations } };
  } catch (error) {
    console.error("Failed to fetch adjustment form options:", error);
    return { success: false, error: "Failed to fetch necessary data" };
  }
}

export async function getAdjustments() {
  try {
    const adjustments = await prisma.stockMove.findMany({
      where: { type: 'Adjustment' },
      include: {
        product: true,
        sourceLocation: true,
        destinationLocation: true,
      },
      orderBy: { date: 'desc' }
    });
    return { success: true, data: adjustments };
  } catch (error) {
    console.error("Failed to fetch adjustments:", error);
    return { success: false, error: "Failed to fetch adjustments" };
  }
}

// Helper to ensure the global 'Loss/Adjustment' location exists
async function getOrCreateAdjustmentLocation() {
  let location = await prisma.location.findFirst({
    where: { type: 'Loss/Adjustment' }
  });
  
  if (!location) {
    location = await prisma.location.create({
      data: {
        name: 'Virtual Adjustment Location',
        type: 'Loss/Adjustment'
      }
    });
  }
  return location;
}

export async function createAdjustment(formData: FormData) {
  try {
    const productId = formData.get("productId") as string;
    const internalLocationId = formData.get("internalLocationId") as string;
    const adjustmentType = formData.get("adjustmentType") as string; // 'Addition' or 'Subtraction'
    const quantityStr = formData.get("quantity") as string;
    const status = (formData.get("status") as string) || "Done";

    if (!productId || !internalLocationId || !adjustmentType || !quantityStr) {
      return { success: false, error: "Missing required fields" };
    }

    const quantity = parseInt(quantityStr);
    if (isNaN(quantity) || quantity <= 0) {
      return { success: false, error: "Quantity must be greater than 0" };
    }

    const adjustmentLocation = await getOrCreateAdjustmentLocation();

    // Determine the double-entry flow based on whether we are adding or subtracting goods
    let sourceLocationId = "";
    let destinationLocationId = "";

    if (adjustmentType === 'Addition') {
      // Stock found: It comes *from* the virtual void and goes *to* our Internal warehouse
      sourceLocationId = adjustmentLocation.id;
      destinationLocationId = internalLocationId;
    } else if (adjustmentType === 'Subtraction') {
      // Stock lost/broken: It leaves our Internal warehouse and goes *to* the virtual void
      sourceLocationId = internalLocationId;
      destinationLocationId = adjustmentLocation.id;
    } else {
      return { success: false, error: "Invalid adjustment type" };
    }

    // Generate reference tag
    const timestamp = Date.now().toString().slice(-6);
    const reference = `ADJ-${new Date().getFullYear()}-${timestamp}`;

    const adjustment = await prisma.stockMove.create({
      data: {
        reference,
        type: 'Adjustment',
        productId,
        sourceLocationId,
        destinationLocationId,
        quantity,
        status,
        date: new Date(),
      }
    });

    revalidatePath("/adjustments");
    return { success: true, data: adjustment };

  } catch (error) {
    console.error("Failed to create adjustment:", error);
    return { success: false, error: "Failed to create inventory adjustment" };
  }
}
