import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderItem } from "@/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      userId,
      addressId,
      items, // [{ productId: number, quantity: number }]
      shippingCost = 0,
      description,
      paymentMethod = "online",
    } = body;

    // ────────────────────────────────
    // 1) اعتبارسنجی
    // ────────────────────────────────
    if (!userId || !addressId || !items || !items.length) {
      return NextResponse.json(
        { error: "اطلاعات سفارش ناقص است" },
        { status: 400 }
      );
    }

    // ────────────────────────────────
    // 2) دریافت قیمت محصولات از دیتابیس
    // ────────────────────────────────
    const productIds = items.map((i: OrderItem) => i.productId);

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    // بررسی وجود همه محصولات
    if (products.length !== items.length) {
      return NextResponse.json(
        { error: "برخی از محصولات یافت نشد" },
        { status: 404 }
      );
    }

    // ────────────────────────────────
    // 3) محاسبه قیمت کل آیتم‌ها
    // totalPrice = sum(product.price * quantity)
    // ────────────────────────────────
    let totalPrice = 0;

    const orderItemsData = items.map((item: OrderItem) => {
      const product = products.find((p) => p.id === item.productId)!;

      const itemTotal = product.price * item.quantity;
      totalPrice += itemTotal;

      return {
         product: { connect: { id: product.id } },
        quantity: item.quantity,
        price: product.price,
        total: itemTotal,
      };
    });

    const finalPrice = totalPrice + shippingCost;

    // ────────────────────────────────
    // 4) ایجاد سفارش
    // ────────────────────────────────
    const order = await prisma.order.create({
      data: {
        // userId,
        // addressId,
        user: { connect: { id: userId } },          // اتصال به کاربر
    address: { connect: { id: addressId } },
        totalPrice,
        shippingCost,
        finalPrice,
        description,
        paymentMethod,
        status: "pending",
        paymentStatus: "unpaid",

        items: {
          create: orderItemsData,
        },
      },

      include: {
    items: { include: { product: true } },
        address: true,
        user: true,
      },
    });

    return NextResponse.json(order, { status: 201 });
 } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "خطا سرور" }, { status: 500 });
  }
}
