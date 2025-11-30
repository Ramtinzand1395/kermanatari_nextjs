// // app/api/products/[slug]/route.ts
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function GET(
//   req: Request,
//   context: { params: Promise<{ id: string }> }
// ) {
//   const { slug } = await context.params;
//   if (!slug) {
//     return NextResponse.json({ error: "Slug موجود نیست" }, { status: 400 });
//   }

//   try {
//     const product = await prisma.product.findUnique({
//       where: { slug },
//       include: {
//         images: true,
//         specifications: { include: { items: true } },
//         category: true,
//         tags: true,
//         comments: {
//           where: { verified: true }, // فقط کامنت‌های تایید شده
//         },
//       },
//     });
//     if (!product)
//       return NextResponse.json({ error: "محصول پیدا نشد" }, { status: 404 });
//     return NextResponse.json(product);
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: "خطای داخلی" }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params; // ✅ unwrap Promise
  if (!slug) {
    return NextResponse.json({ error: "Slug موجود نیست" }, { status: 400 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: true,
        specifications: { include: { items: true } },
        category: true,
        tags: true,
        comments: { where: { verified: true } },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "محصول پیدا نشد" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "خطای داخلی" }, { status: 500 });
  }
}
