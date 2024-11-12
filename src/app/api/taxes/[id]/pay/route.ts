import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { TAX_STATUS } from '@/constants/taxes';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tax = await prisma.tax.update({
      where: { id: params.id },
      data: {
        status: TAX_STATUS.PAID,
        paymentDate: new Date(),
      },
    });

    return NextResponse.json(tax);
  } catch (error) {
    console.error('Error al actualizar impuesto:', error);
    return NextResponse.json(
      { error: "Error al actualizar impuesto" },
      { status: 500 }
    );
  }
} 