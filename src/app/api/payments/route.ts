import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        client: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
    return NextResponse.json(payments);
  } catch (error) {
    console.error('Error al obtener pagos:', error);
    return NextResponse.json(
      { error: "Error al obtener pagos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.clientId || !data.amount || !data.method) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.create({
      data: {
        clientId: data.clientId,
        amount: data.amount,
        method: data.method,
        date: data.date ? new Date(data.date) : new Date(),
        description: data.description,
      },
      include: {
        client: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error('Error al crear pago:', error);
    return NextResponse.json(
      { error: "Error al crear pago" },
      { status: 500 }
    );
  }
} 