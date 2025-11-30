// app/api/orders/route.ts
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

    const orders = await prisma.order.findMany({
      where: { userId: Number(session.user.id) },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: {
              select: {
                title: true,
                mainImage: true,
              },
            },
          },
        },
        address: true,
      },
    });

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
