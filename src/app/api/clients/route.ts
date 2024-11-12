import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(clients);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    return NextResponse.json(
      { error: "Error al obtener clientes" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validación básica
    if (!data.name) {
      return NextResponse.json(
        { error: "El nombre es requerido" },
        { status: 400 }
      );
    }

    // Crear el cliente
    const client = await prisma.client.create({
      data: {
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address || null,
      }
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error('Error al crear cliente:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Error al crear cliente: ${error.message}` },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Error al crear cliente" },
      { status: 500 }
    );
  }
} 