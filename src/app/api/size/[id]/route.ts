import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name } = body;

    const existing = await prisma.size.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      return NextResponse.json(
        {
          message: "Size not found",
        },
        { status: 404 },
      );
    }

    const updatedSize = await prisma.size.update({
      where: { id: Number(id) },
      data: { name },
    });

    return NextResponse.json({
      message: "Size updated",
      data: updatedSize,
    });
  } catch (error) {
    console.error("Update size error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const existing = await prisma.size.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      return NextResponse.json({ message: "Size not found" }, { status: 404 });
    }

    await prisma.size.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({
      message: "Size deleted successfully",
    });
  } catch (error) {
    console.error("Delete size error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
