import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        address: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // آماده‌سازی داده برای فرانت
    const formattedOrders = orders.map((order) => ({
      id: order.id,
      userName: order.user?.name || "کاربر ناشناس",
      finalPrice: order.finalPrice,
      status: order.status,
      createdAt: order.createdAt,
      items: order.items.map((item) => ({
        name: item.product.title,
        quantity: item.quantity,
        price: item.price,
      })),
      address: order.address,
    }));

    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "خطا در دریافت سفارش‌ها" },
      { status: 500 }
    );
  }
}

interface OrderItemInput {
  productId: number;
  quantity: number;
  price: number;
}

// export async function POST(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);

//     const userId = searchParams.get("userId");
//     const body = await req.json();

//     const {
//       addressId,
//       items,
//       shippingCost = 0,
//       paymentMethod = "online",
//       description,
//     }: {
//       addressId?: number;
//       items: OrderItemInput[];
//       shippingCost?: number;
//       paymentMethod?: "online" | "cod";
//       description?: string;
//     } = body;

//     if (!userId || !items || items.length === 0) {
//       return NextResponse.json(
//         { error: "کاربر و آیتم‌ها الزامی هستند" },
//         { status: 400 }
//       );
//     }

//     // محاسبه مجموع قیمت
//     const totalPrice = items.reduce(
//       (sum, item) => sum + item.price * item.quantity,
//       0
//     );
//     const finalPrice = totalPrice + shippingCost;

//     // ایجاد سفارش
//     const newOrder = await prisma.order.create({
//       data: {
//         addressId,
//         totalPrice,
//         shippingCost,
//         finalPrice,
//         paymentMethod,
//         items: {
//           create: items.map((item) => ({
//             productId: item.productId,
//             quantity: item.quantity,
//             price: item.price,
//             total: item.price * item.quantity,
//           })),
//         },
//         description: description || "",
//       },
//       include: {
//         items: true,
//       },
//     });

//     return NextResponse.json(newOrder, { status: 201 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "خطا در ایجاد سفارش" }, { status: 500 });
//   }
// }


export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "شناسه کاربر الزامی است" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
    if (!user) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    const body = await req.json();
    const {
      addressId,
      items,
      shippingCost = 0,
      paymentMethod = "online",
      description,
    }: {
      addressId?: number;
      items: OrderItemInput[];
      shippingCost?: number;
      paymentMethod?: "online" | "cod";
      description?: string;
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "آیتم‌ها الزامی هستند" },
        { status: 400 }
      );
    }

    // بررسی آدرس (اختیاری)
    if (addressId) {
      const address = await prisma.address.findUnique({
        where: { id: addressId },
      });
      if (!address || address.userId !== Number(userId)) {
        return NextResponse.json(
          { error: "آدرس نامعتبر است" },
          { status: 400 }
        );
      }
    }

    // محاسبه مجموع قیمت
    const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const finalPrice = totalPrice + shippingCost;

    // ایجاد سفارش و اتصال به کاربر
    const newOrder = await prisma.order.create({
      data: {
        userId: Number(userId), // اتصال به کاربر
        addressId,
        totalPrice,
        shippingCost,
        finalPrice,
        paymentMethod,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
          })),
        },
        description: description || "",
      },
      include: {
        items: {
          include: { product: true }, // شامل اطلاعات محصول
        },
      },
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "خطا در ایجاد سفارش" }, { status: 500 });
  }
}
