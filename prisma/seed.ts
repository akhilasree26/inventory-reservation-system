import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear old data
  await prisma.reservation.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.warehouse.deleteMany();

  // Create products
  const iphone = await prisma.product.create({
    data: {
      name: "iPhone 15",
    },
  });

  const samsung = await prisma.product.create({
    data: {
      name: "Samsung S24",
    },
  });

  // Create warehouses
  const warehouse1 = await prisma.warehouse.create({
    data: {
      name: "Bangalore Warehouse",
      location: "Bangalore",
    },
  });

  const warehouse2 = await prisma.warehouse.create({
    data: {
      name: "Hyderabad Warehouse",
      location: "Hyderabad",
    },
  });

  // Create inventory
  await prisma.inventory.createMany({
    data: [
      {
        productId: iphone.id,
        warehouseId: warehouse1.id,
        totalStock: 10,
      },
      {
        productId: iphone.id,
        warehouseId: warehouse2.id,
        totalStock: 5,
      },
      {
        productId: samsung.id,
        warehouseId: warehouse1.id,
        totalStock: 7,
      },
    ],
  });

  console.log("Seed data inserted successfully");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });