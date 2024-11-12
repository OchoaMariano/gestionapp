import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: {
        date: 'desc',
      },
    });
    return NextResponse.json(expenses);
  } catch (error) {
    console.error('Error al obtener egresos:', error);
    return NextResponse.json(
      { error: "Error al obtener egresos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.description || !data.category || !data.amount) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    const expense = await prisma.expense.create({
      data: {
        description: data.description,
        category: data.category,
        amount: data.amount,
        date: data.date ? new Date(data.date) : new Date(),
      },
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error('Error al crear egreso:', error);
    return NextResponse.json(
      { error: "Error al crear egreso" },
      { status: 500 }
    );
  }
} 