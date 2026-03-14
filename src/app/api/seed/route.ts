import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const passwordHash = await bcrypt.hash('admin123', 10);
    
    // Create Admin User
    const admin = await prisma.user.upsert({
      where: { email: 'admin@coreinventory.com' },
      update: {},
      create: {
        email: 'admin@coreinventory.com',
        name: 'Admin User',
        password: passwordHash,
      },
    });

    // Create Locations
    await prisma.location.upsert({
      where: { name: 'Main Warehouse' },
      update: {},
      create: { name: 'Main Warehouse', type: 'Internal' }
    });
    
    await prisma.location.upsert({
      where: { name: 'Steel Suppliers Inc' },
      update: {},
      create: { name: 'Steel Suppliers Inc', type: 'Vendor' }
    });

    // Create Categories
    const rawMaterials = await prisma.category.upsert({
      where: { name: 'Raw Materials' },
      update: {},
      create: { name: 'Raw Materials' }
    });
    
    const finishedGoods = await prisma.category.upsert({
      where: { name: 'Finished Goods' },
      update: {},
      create: { name: 'Finished Goods' }
    });

    // Create Products
    const products = [
      { name: 'Steel Rods', sku: 'RAW-STL-001', categoryId: rawMaterials.id, uom: 'kg', reorderLevel: 500 },
      { name: 'Aluminum Sheets', sku: 'RAW-ALU-002', categoryId: rawMaterials.id, uom: 'Sheets', reorderLevel: 200 },
      { name: 'Office Chair', sku: 'FG-CHR-001', categoryId: finishedGoods.id, uom: 'Units', reorderLevel: 50 },
      { name: 'Standing Desk', sku: 'FG-DSK-002', categoryId: finishedGoods.id, uom: 'Units', reorderLevel: 20 }
    ];

    for (const p of products) {
      await prisma.product.upsert({
        where: { sku: p.sku },
        update: {},
        create: p,
      });
    }

    return NextResponse.json({ success: true, message: 'Database seeded successfully on Vercel!' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
