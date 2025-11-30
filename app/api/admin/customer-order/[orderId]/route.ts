// // app/api/abtin/order/[orderId]/route.ts
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function PUT(req, ctx) {
//   try {
//     const { orderId } = await ctx.params;

//     const body = await req.json();

//     // جلوگیری از آپدیت id
//     delete body.id;

//     // جلوگیری از آپدیت customer object
//     delete body.customer;

//     // لیست اگر آرایه بود، استرینگ شود
//     if (Array.isArray(body.list)) {
//       body.list = JSON.stringify(body.list);
//     }

//     const updated = await prisma.customerOrder.update({
//       where: { id: Number(orderId) },
//       data: body,
//     });

//     const populated = await prisma.customerOrder.findUnique({
//       where: { id: updated.id },
//       include: { customer: true },
//     });

//     return NextResponse.json({ message: "سفارش ویرایش شد.", Data: populated });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ message: "server error" }, { status: 500 });
//   }
// }

// export async function DELETE(req, ctx) {
//   try {
//     // unwrap params از context
//     const { orderId } = await ctx.params;
//     if (!orderId) {
//       return NextResponse.json({ message: "OrderId یافت نشد" }, { status: 400 });
//     }

//     const deleted = await prisma.customerOrder.delete({
//       where: { id: Number(orderId) },
//     });

//     return NextResponse.json({ message: "سفارش حذف شد.", data: deleted });
//   } catch (err: any) {
//     console.error(err);
//     return NextResponse.json({ message: err.message || "server error" }, { status: 500 });
//   }
// }
// todo
// !کلا اشتباه
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderItem } from "@/types";
import { Product } from "@prisma/client";

interface CreateOrderBody {
  userId: number;
  addressId: number;
  items: OrderItem[]; // [{ productId: number, quantity: number }]
  shippingCost?: number;
  description?: string;
  paymentMethod?: "online" | "offline";
}

export async function POST(req: Request) {
  try {
    const body: CreateOrderBody = await req.json();

    const {
      userId,
      addressId,
      items,
      shippingCost = 0,
      description = "",
      paymentMethod = "online",
    } = body;

    // ────────────────────────────────
    // 1) اعتبارسنجی
    // ────────────────────────────────
    if (!userId || !addressId || !items || items.length === 0) {
      return NextResponse.json(
        { error: "اطلاعات سفارش ناقص است" },
        { status: 400 }
      );
    }

    // ────────────────────────────────
    // 2) دریافت اطلاعات محصولات
    // ────────────────────────────────
    const productIds = items.map((i) => i.productId);

    const products: Product[] = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== items.length) {
      return NextResponse.json(
        { error: "برخی از محصولات یافت نشد" },
        { status: 404 }
      );
    }

    // ────────────────────────────────
    // 3) محاسبه قیمت کل آیتم‌ها
    // ────────────────────────────────
    let totalPrice = 0;

    const orderItemsData = items.map((item: OrderItem) => {
      const product = products.find((p: Product) => p.id === item.productId)!;

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
        user: { connect: { id: userId } },
        address: { connect: { id: addressId } },
        totalPrice,
        shippingCost,
        finalPrice,
        description,
        paymentMethod,
        status: "pending",
        paymentStatus: "unpaid",
        items: { create: orderItemsData },
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
