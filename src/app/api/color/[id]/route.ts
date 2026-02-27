import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name } = body;

    const existing = await prisma.color.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      return NextResponse.json(
        {
          message: "Color not found",
        },
        { status: 404 },
      );
    }

    const updatedColor = await prisma.color.update({
      where: { id: Number(id) },
      data: { name },
    });

    return NextResponse.json({
      message: "Color updated",
      data: updatedColor,
    });
  } catch (error) {
    console.error("Update color error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const existing = await prisma.color.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      return NextResponse.json({ message: "Color not found" }, { status: 404 });
    }

    await prisma.color.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({
      message: "Color deleted successfully",
    });
  } catch (error) {
    console.error("Delete Color error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
