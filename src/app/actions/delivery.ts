"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getDeliveryFormOptions() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { name: 'asc' }
    });
    // For a real app, you might have specific 'Customer' locations
    // But to keep it flexible, let's grab all non-Internal for destinations
    // Or we can explicitly create/fetch 'Customer' types if they exist over time
    // We'll just fetch all for now and let the UI filter if needed, 
    // but ideally: Vendor/Customer.
    const customers = await prisma.location.findMany({
      where: { 
        type: {
          not: 'Internal' 
        }
      },
      orderBy: { name: 'asc' }
    });
    
    // Internal warehouses where goods ship from
    const internalLocations = await prisma.location.findMany({
      where: { type: 'Internal' },
      orderBy: { name: 'asc' }
    });

    return { success: true, data: { products, customers, internalLocations } };
  } catch (error) {
    console.error("Failed to fetch delivery form options:", error);
    return { success: false, error: "Failed to fetch necessary data" };
  }
}

export async function getDeliveries() {
  try {
    const deliveries = await prisma.stockMove.findMany({
      where: { type: 'Delivery' },
      include: {
        product: true,
        sourceLocation: true,
        destinationLocation: true,
      },
      orderBy: { date: 'desc' }
    });
    return { success: true, data: deliveries };
  } catch (error) {
    console.error("Failed to fetch deliveries:", error);
    return { success: false, error: "Failed to fetch deliveries" };
  }
}

export async function createDelivery(formData: FormData) {
  try {
    const productId = formData.get("productId") as string;
    const sourceLocationId = formData.get("sourceLocationId") as string; // from warehouse
    const destinationLocationId = formData.get("destinationLocationId") as string; // to customer
    const quantityStr = formData.get("quantity") as string;
    const status = (formData.get("status") as string) || "Done";

    if (!productId || !sourceLocationId || !destinationLocationId || !quantityStr) {
      return { success: false, error: "Missing required fields" };
    }

    const quantity = parseInt(quantityStr);
    if (isNaN(quantity) || quantity <= 0) {
      return { success: false, error: "Quantity must be greater than 0" };
    }

    // Generate reference tag
    const timestamp = Date.now().toString().slice(-6);
    const reference = `OUT-${new Date().getFullYear()}-${timestamp}`;

    const delivery = await prisma.stockMove.create({
      data: {
        reference,
        type: 'Delivery',
        productId,
        sourceLocationId,
        destinationLocationId,
        quantity,
        status,
        date: new Date(),
      }
    });

    revalidatePath("/deliveries");
    return { success: true, data: delivery };

  } catch (error) {
    console.error("Failed to create delivery:", error);
    return { success: false, error: "Failed to create delivery" };
  }
}
