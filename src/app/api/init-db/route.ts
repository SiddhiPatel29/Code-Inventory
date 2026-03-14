import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // 1. Create User table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "User" (
          "id" TEXT PRIMARY KEY,
          "name" TEXT NOT NULL,
          "email" TEXT NOT NULL UNIQUE,
          "password" TEXT NOT NULL,
          "otpToken" TEXT,
          "otpExpiry" TIMESTAMP(3),
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Create Category table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Category" (
          "id" TEXT PRIMARY KEY,
          "name" TEXT NOT NULL UNIQUE,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Create Product table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Product" (
          "id" TEXT PRIMARY KEY,
          "name" TEXT NOT NULL,
          "sku" TEXT NOT NULL UNIQUE,
          "categoryId" TEXT REFERENCES "Category"("id") ON DELETE SET NULL,
          "uom" TEXT NOT NULL DEFAULT 'Units',
          "reorderLevel" INTEGER NOT NULL DEFAULT 0,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Create Location table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Location" (
          "id" TEXT PRIMARY KEY,
          "name" TEXT NOT NULL UNIQUE,
          "type" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. Create StockMove table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "StockMove" (
          "id" TEXT PRIMARY KEY,
          "reference" TEXT NOT NULL,
          "type" TEXT NOT NULL,
          "productId" TEXT NOT NULL REFERENCES "Product"("id"),
          "sourceLocationId" TEXT NOT NULL REFERENCES "Location"("id"),
          "destinationLocationId" TEXT NOT NULL REFERENCES "Location"("id"),
          "quantity" INTEGER NOT NULL,
          "status" TEXT NOT NULL,
          "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    return NextResponse.json({ 
      success: true, 
      message: "Database tables created/verified successfully!" 
    });
  } catch (error: any) {
    console.error("DB Initialization Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Failed to initialize database." 
    }, { status: 500 });
  }
}
