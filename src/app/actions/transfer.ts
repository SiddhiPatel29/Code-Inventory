"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTransferFormOptions() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { name: 'asc' }
    });
    
    // Both Source and Destination must be Internal warehouses
    const internalLocations = await prisma.location.findMany({
      where: { type: 'Internal' },
      orderBy: { name: 'asc' }
    });

    return { success: true, data: { products, internalLocations } };
  } catch (error) {
    console.error("Failed to fetch transfer form options:", error);
    return { success: false, error: "Failed to fetch necessary data" };
  }
}

export async function getTransfers() {
  try {
    const transfers = await prisma.stockMove.findMany({
      where: { type: 'Transfer' },
      include: {
        product: true,
        sourceLocation: true,
        destinationLocation: true,
      },
      orderBy: { date: 'desc' }
    });
    return { success: true, data: transfers };
  } catch (error) {
    console.error("Failed to fetch transfers:", error);
    return { success: false, error: "Failed to fetch transfers" };
  }
}

export async function createTransfer(formData: FormData) {
  try {
    const productId = formData.get("productId") as string;
    const sourceLocationId = formData.get("sourceLocationId") as string; // from warehouse
    const destinationLocationId = formData.get("destinationLocationId") as string; // to warehouse
    const quantityStr = formData.get("quantity") as string;
    const status = (formData.get("status") as string) || "Done";

    if (!productId || !sourceLocationId || !destinationLocationId || !quantityStr) {
      return { success: false, error: "Missing required fields" };
    }
    
    if (sourceLocationId === destinationLocationId) {
       return { success: false, error: "Source and Destination warehouse cannot be the same" };
    }

    const quantity = parseInt(quantityStr);
    if (isNaN(quantity) || quantity <= 0) {
      return { success: false, error: "Quantity must be greater than 0" };
    }

    // Generate reference tag
    const timestamp = Date.now().toString().slice(-6);
    const reference = `TRF-${new Date().getFullYear()}-${timestamp}`;

    const transfer = await prisma.stockMove.create({
      data: {
        reference,
        type: 'Transfer',
        productId,
        sourceLocationId,
        destinationLocationId,
        quantity,
        status,
        date: new Date(),
      }
    });

    revalidatePath("/transfers");
    return { success: true, data: transfer };

  } catch (error) {
    console.error("Failed to create transfer:", error);
    return { success: false, error: "Failed to create internal transfer" };
  }
}
