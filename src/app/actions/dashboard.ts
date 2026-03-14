"use server";

import prisma from "@/lib/prisma";

export async function getDashboardStats() {
  try {
    const totalProducts = await prisma.product.count();
    
    // We consider "Low Stock" if total quantity in Internal locations is <= reorderLevel
    // For a complex dashboard we'd calculate on-hand stock per product,
    // For now we'll just mock the query or return a static calculation
    // until we aggregate all StockMoves per product.
    const lowStockCount = 0; // Requires aggregation of StockMoves

    const pendingReceipts = await prisma.stockMove.count({
      where: {
        type: 'Receipt',
        status: { not: 'Done' }
      }
    });

    const pendingDeliveries = await prisma.stockMove.count({
      where: {
        type: 'Delivery',
        status: { not: 'Done' }
      }
    });

    return {
      success: true,
      data: {
        totalProducts,
        lowStockCount,
        pendingReceipts,
        pendingDeliveries,
      }
    };
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return { success: false, error: "Failed to fetch dashboard data" };
  }
}

export async function getRecentActivity() {
  try {
    const recentActivity = await prisma.stockMove.findMany({
      take: 5,
      orderBy: { date: 'desc' },
      include: {
        product: true,
        sourceLocation: true,
        destinationLocation: true,
      }
    });

    return { success: true, data: recentActivity };
  } catch (error) {
    console.error("Failed to fetch recent activity:", error);
    return { success: false, error: "Failed to fetch activity" };
  }
}
