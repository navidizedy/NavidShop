import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name } = body;

    const existingSize = await prisma.size.findUnique({
      where: { name },
    });
    if (existingSize) {
      return NextResponse.json(
        {
          message: "Size already exists",
        },
        { status: 409 }
      );
    }
    const size = await prisma.size.create({
      data: { name },
    });
    return NextResponse.json(
      {
        message: "Size added",
        data: size,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add size error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
    const sizes = await prisma.size.findMany();
    return NextResponse.json({
      data: sizes,
    });
  } catch (error) {
    console.error("Get All sizes error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
