import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const colors = await prisma.color.findMany();
    return NextResponse.json({
      data: colors,
    });
  } catch (error) {
    console.error("Get All colors error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name } = body;

    const existingColor = await prisma.color.findUnique({
      where: { name },
    });
    if (existingColor) {
      return NextResponse.json(
        {
          message: "Color already exists",
        },
        { status: 409 },
      );
    }

    const color = await prisma.color.create({
      data: {
        name,
      },
    });
    return NextResponse.json(
      {
        message: "Color added",
        data: color,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Add color error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
