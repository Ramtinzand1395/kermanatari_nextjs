import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category");
    const sortParam = searchParams.get("sort");
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 12);
    const skip = (page - 1) * limit;

    const whereClause: any = {};
    if (categorySlug) {
      const mainCategory = await prisma.category.findUnique({
        where: { slug: categorySlug },
        select: { id: true },
      });
      if (mainCategory) whereClause.categoryId = mainCategory.id;
    }

    let orderBy: any = { createdAt: "desc" };
    switch (sortParam) {
      case "highPrice":
        orderBy = { price: "desc" };
        break;
      case "lowPrice":
        orderBy = { price: "asc" };
        break;
      case "bestSeller":
        orderBy = { soldCount: "desc" };
        break;
      case "highestDiscount":
        orderBy = { discountPrice: "asc" };
        break;
      case "newest":
      default:
        orderBy = { createdAt: "desc" };
    }

    const total = await prisma.product.count({ where: whereClause });

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        comments: {
          where: { verified: true }, // فقط کامنت‌های تایید شده
        },
        images: true,
        tags: true,
      },
      orderBy,
      skip,
      take: limit,
    });

    return NextResponse.json({ products, total, page, limit });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "خطا در دریافت محصولات" },
      { status: 500 }
    );
  }
}
