import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "کاربر لاگین نیست" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        items: { include: { product: true } },
        address: true,
      },
    });

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "خطا در دریافت سفارش‌ها" }, { status: 500 });
  }
}
