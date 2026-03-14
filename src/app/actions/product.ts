"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      }
    });
    return { success: true, data: products };
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return { success: false, error: "Failed to fetch products" };
  }
}

export async function createProduct(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const sku = formData.get("sku") as string;
    const uom = formData.get("uom") as string || "Units";
    const reorderLevel = parseInt(formData.get("reorderLevel") as string) || 0;
    const categoryName = formData.get("category") as string;

    if (!name || !sku) {
      return { success: false, error: "Name and SKU are required" };
    }

    // Handle Category logic (find or create)
    let categoryId = null;
    if (categoryName) {
      let category = await prisma.category.findUnique({
        where: { name: categoryName }
      });
      
      if (!category) {
        category = await prisma.category.create({
          data: { name: categoryName }
        });
      }
      categoryId = category.id;
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        sku,
        uom,
        reorderLevel,
        categoryId,
      }
    });

    revalidatePath("/products");
    return { success: true, data: newProduct };

  } catch (error: any) {
    console.error("Failed to create product:", error);
    // basic unique constraint handling
    if (error?.code === 'P2002') {
      return { success: false, error: `SKU must be unique` };
    }
    return { success: false, error: "Failed to create product" };
  }
}
