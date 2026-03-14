import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // 1. Create Admin User
  const passwordHash = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@coreinventory.com' },
    update: {},
    create: {
      email: 'admin@coreinventory.com',
      name: 'Admin User',
      password: passwordHash,
    },
  })
  console.log(`Created admin user: ${admin.email} (pw: admin123)`)

  // 2. Create Locations
  const warehouse = await prisma.location.upsert({
    where: { name: 'Main Warehouse' },
    update: {},
    create: {
      name: 'Main Warehouse',
      type: 'Internal'
    }
  })
  
  const vendor = await prisma.location.upsert({
    where: { name: 'Steel Suppliers Inc' },
    update: {},
    create: {
      name: 'Steel Suppliers Inc',
      type: 'Vendor'
    }
  })

  // 3. Create Categories
  const rawMaterials = await prisma.category.upsert({
    where: { name: 'Raw Materials' },
    update: {},
    create: { name: 'Raw Materials' }
  })
  
  const finishedGoods = await prisma.category.upsert({
    where: { name: 'Finished Goods' },
    update: {},
    create: { name: 'Finished Goods' }
  })

  // 4. Create Products
  const products = [
    {
      name: 'Steel Rods',
      sku: 'RAW-STL-001',
      categoryId: rawMaterials.id,
      uom: 'kg',
      reorderLevel: 500
    },
    {
      name: 'Aluminum Sheets',
      sku: 'RAW-ALU-002',
      categoryId: rawMaterials.id,
      uom: 'Sheets',
      reorderLevel: 200
    },
    {
      name: 'Office Chair',
      sku: 'FG-CHR-001',
      categoryId: finishedGoods.id,
      uom: 'Units',
      reorderLevel: 50
    },
    {
      name: 'Standing Desk',
      sku: 'FG-DSK-002',
      categoryId: finishedGoods.id,
      uom: 'Units',
      reorderLevel: 20
    }
  ]

  for (const productData of products) {
    await prisma.product.upsert({
      where: { sku: productData.sku },
      update: {},
      create: productData,
    })
  }
  console.log(`Created ${products.length} products`)

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
