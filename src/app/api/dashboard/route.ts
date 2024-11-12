import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { startOfYear, endOfYear } from "date-fns";

export async function GET() {
  try {
    const startDate = startOfYear(new Date());
    const endDate = endOfYear(new Date());

    const [payments, expenses, taxes] = await Promise.all([
      prisma.payment.findMany({
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: {
          date: 'asc',
        },
      }),
      prisma.expense.findMany({
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: {
          date: 'asc',
        },
      }),
      prisma.tax.findMany({
        where: {
          dueDate: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: {
          dueDate: 'asc',
        },
      }),
    ]);

    return NextResponse.json({
      payments,
      expenses,
      taxes,
    });
  } catch (error) {
    console.error('Error al obtener datos del dashboard:', error);
    return NextResponse.json(
      { error: "Error al obtener datos del dashboard" },
      { status: 500 }
    );
  }
} 