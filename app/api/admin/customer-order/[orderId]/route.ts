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

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: { orderId: string };
}

export async function DELETE(req: NextRequest, ctx: Params) {
  try {
    const { orderId } = ctx.params;

    if (!orderId) {
      return NextResponse.json(
        { message: "OrderId یافت نشد" },
        { status: 400 }
      );
    }

    const deleted = await prisma.customerOrder.delete({
      where: { id: Number(orderId) },
    });

    return NextResponse.json({ message: "سفارش حذف شد.", data: deleted });
   } catch (err: unknown) {
    console.error(err);

    const message =
      err instanceof Error ? err.message : "server error";

    return NextResponse.json({ message }, { status: 500 });
  }
}
