// app/api/gamelistitem/[id]/route.ts
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // const { id } = params;
  const gameId = Number(params.id);
  if (isNaN(gameId)) {
    return NextResponse.json({ error: "شناسه نامعتبر است" }, { status: 400 });
  }

  try {
    await prisma.gameListItem.delete({
      where: { id: gameId },
    });
    return NextResponse.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Item not found or cannot delete" },
      { status: 404 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // const { id } = params;
  const gameId = Number(params.id);
  if (isNaN(gameId)) {
    return NextResponse.json({ error: "شناسه نامعتبر است" }, { status: 400 });
  }
  const body = await req.json();

  try {
    const updatedItem = await prisma.gameListItem.update({
      where: { id: gameId },
      data: body, // مثلا { name: "new name" }
    });
    return NextResponse.json(updatedItem);
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Item not found or cannot update" },
      { status: 404 }
    );
  }
}
