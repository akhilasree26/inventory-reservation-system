import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { inventoryId, quantity } = body;

    if (!inventoryId || !quantity) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx: any) => {
      // Get latest inventory row
      const inventory = await tx.inventory.findUnique({
        where: {
          id: inventoryId,
        },
      });

      if (!inventory) {
        throw new Error("Inventory not found");
      }

      const availableStock =
        inventory.totalStock - inventory.reservedStock;

      // Prevent overselling
      if (availableStock < quantity) {
        return {
          error: "Not enough stock",
          status: 409,
        };
      }

      // Increase reserved stock
      await tx.inventory.update({
        where: {
          id: inventoryId,
        },
        data: {
          reservedStock: {
            increment: quantity,
          },
        },
      });

      // Create reservation
      const reservation = await tx.reservation.create({
        data: {
          inventoryId,
          quantity,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
      });

      return {
        reservation,
        status: 200,
      };
    });

    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }

    return NextResponse.json(result.reservation);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Reservation failed" },
      { status: 500 }
    );
  }
}