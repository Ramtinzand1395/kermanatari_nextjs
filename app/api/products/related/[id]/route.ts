import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const productId = Number(id);
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID معتبر نیست" },
        { status: 400 }
      );
    }

    // گرفتن محصول اصلی همراه با تگ‌ها
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { tags: true },
    });

    if (!product) {
      return NextResponse.json({ error: "محصول یافت نشد" }, { status: 404 });
    }

    const tagIds = product.tags.map((tag) => tag.id);

    if (tagIds.length === 0) {
      return NextResponse.json({ relatedProducts: [] }, { status: 200 });
    }

    // گرفتن محصولات مشابه
    const relatedProducts = await prisma.product.findMany({
      where: {
        id: { not: productId },
        tags: {
          some: {
            id: { in: tagIds },
          },
        },
      },
      include: {
        images: true,
        category: true,
        tags: true,
      },
      take: 5,
    });

    return NextResponse.json({ relatedProducts });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "خطای سرور", details: error.message },
      { status: 500 }
    );
  }
}

// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function GET(
//   req: Request,
//   context: { params: Promise<{ id: string }> }
// ) {
//   // const id = params.id;
//   const { id } = await context.params;

//   console.log(id);
//   try {
//     return NextResponse.json({ message: "hi" });
//   } catch (error: any) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "خطای سرور", details: error.message },
//       { status: 500 }
//     );
//   }
// }
