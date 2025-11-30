// app/api/products/[slug]/comments/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "کاربر وارد نشده" }, { status: 401 });
    }

    const comments = await prisma.comment.findMany({
      where: { userId: Number(session.user.id) },
      orderBy: { createdAt: "desc" },
      include: {
        product: {
          select: {
            title: true,
            mainImage: true, // فرض بر این است که عکس اصلی محصول در این فیلد است
          },
        },
      },
    });

    return NextResponse.json(comments);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
