import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all orders with pagination
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page") || 1);
    const limit = Number(url.searchParams.get("limit") || 10);

    const orders = await prisma.order.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        address: true,
        items: {
          include: { product: true },
        },
      },
    });

    const total = await prisma.order.count();

    return NextResponse.json({ orders, total, page, limit });
  } catch (error: unknown) {
    console.error(error);
    const message = error instanceof Error ? error.message : "خطا در دریافت سفارش‌ها";
    return NextResponse.json({ error: message });
  }
}

// PATCH update order status
export async function PUT(req: Request) {
  try {
    const { orderId, status } = await req.json();
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
    return NextResponse.json(updatedOrder);
   } catch (error: unknown) {
    console.error(error);
    const message = error instanceof Error ? error.message : "خطا در بروزرسانی استاتوس";
    return NextResponse.json({ error: message });
  }
}