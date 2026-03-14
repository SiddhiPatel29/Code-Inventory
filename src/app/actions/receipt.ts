"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getReceiptFormOptions() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { name: 'asc' }
    });
    const vendors = await prisma.location.findMany({
      where: { type: 'Vendor' },
      orderBy: { name: 'asc' }
    });
    const internalLocations = await prisma.location.findMany({
      where: { type: 'Internal' },
      orderBy: { name: 'asc' }
    });

    return { success: true, data: { products, vendors, internalLocations } };
  } catch (error) {
    console.error("Failed to fetch receipt form options:", error);
    return { success: false, error: "Failed to fetch necessary data" };
  }
}

export async function getReceipts() {
  try {
    const receipts = await prisma.stockMove.findMany({
      where: { type: 'Receipt' },
      include: {
        product: true,
        sourceLocation: true,
        destinationLocation: true,
      },
      orderBy: { date: 'desc' }
    });
    return { success: true, data: receipts };
  } catch (error) {
    console.error("Failed to fetch receipts:", error);
    return { success: false, error: "Failed to fetch receipts" };
  }
}

export async function createReceipt(formData: FormData) {
  try {
    const productId = formData.get("productId") as string;
    const sourceLocationId = formData.get("sourceLocationId") as string;
    const destinationLocationId = formData.get("destinationLocationId") as string;
    const quantityStr = formData.get("quantity") as string;
    const status = (formData.get("status") as string) || "Done";

    if (!productId || !sourceLocationId || !destinationLocationId || !quantityStr) {
      return { success: false, error: "Missing required fields" };
    }

    const quantity = parseInt(quantityStr);
    if (isNaN(quantity) || quantity <= 0) {
      return { success: false, error: "Quantity must be greater than 0" };
    }

    // Generate reference
    const timestamp = Date.now().toString().slice(-6);
    const reference = `RCPT-${new Date().getFullYear()}-${timestamp}`;

    const receipt = await prisma.stockMove.create({
      data: {
        reference,
        type: 'Receipt',
        productId,
        sourceLocationId,
        destinationLocationId,
        quantity,
        status,
        date: new Date(),
      }
    });

    revalidatePath("/receipts");
    return { success: true, data: receipt };

  } catch (error) {
    console.error("Failed to create receipt:", error);
    return { success: false, error: "Failed to create receipt" };
  }
}
