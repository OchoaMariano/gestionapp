import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { TAX_STATUS } from '@/constants/taxes';

interface Tax {
  status: string;
  dueDate: Date;
}

export async function GET() {
  try {
    const taxes = await prisma.tax.findMany({
      orderBy: {
        dueDate: 'asc',
      },
    });
    
    // Actualizar estado de impuestos vencidos
    const today = new Date();
    const updatedTaxes = taxes.map((tax: Tax) => ({
      ...tax,
      status: tax.status === TAX_STATUS.PAID ? TAX_STATUS.PAID :
        new Date(tax.dueDate) < today ? TAX_STATUS.OVERDUE : TAX_STATUS.PENDING
    }));

    return NextResponse.json(updatedTaxes);
  } catch (error) {
    console.error('Error al obtener impuestos:', error);
    return NextResponse.json(
      { error: "Error al obtener impuestos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.type || !data.amount || !data.dueDate) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    const tax = await prisma.tax.create({
      data: {
        type: data.type,
        amount: data.amount,
        dueDate: new Date(data.dueDate),
        status: TAX_STATUS.PENDING,
        description: data.description,
      },
    });

    return NextResponse.json(tax, { status: 201 });
  } catch (error) {
    console.error('Error al crear impuesto:', error);
    return NextResponse.json(
      { error: "Error al crear impuesto" },
      { status: 500 }
    );
  }
} 