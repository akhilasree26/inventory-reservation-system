import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await params;

    const reservation = await prisma.reservation.findUnique({
      where: {
        id,
      },
    });

    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    // Check expiry
    if (
      reservation.status !== "PENDING" ||
      new Date() > reservation.expiresAt
    ) {
      return NextResponse.json(
        { error: "Reservation expired" },
        { status: 410 }
      );
    }

    const updatedReservation =
      await prisma.reservation.update({
        where: {
          id,
        },
        data: {
          status: "CONFIRMED",
        },
      });

    return NextResponse.json(updatedReservation);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Confirmation failed" },
      { status: 500 }
    );
  }
}