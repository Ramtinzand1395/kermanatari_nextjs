

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category");
    const hasDiscount = searchParams.get("discount");

    const whereClause: any = {};

    // فیلتر بر اساس تخفیف
    if (hasDiscount === "true") {
      whereClause.discountPrice = { not: null };
    }

    // فیلتر بر اساس دسته‌بندی با slug (نه id)
    if (categorySlug) {
      // پیدا کردن دسته با slug
      const mainCategory = await prisma.category.findUnique({
        where: { slug: categorySlug },
        select: { id: true },
      });

      if (mainCategory) {
        // پیدا کردن زیر‌دسته‌ها
        const subCategories = await prisma.category.findMany({
          where: { parentId: mainCategory.id },
          select: { id: true },
        });

        const categoryIds = [
          mainCategory.id,
          ...subCategories.map((c) => c.id),
        ];
        whereClause.categoryId = { in: categoryIds };
      }
    }


    // دریافت محصولات
    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: true,
        images: true,
        tags: true,
       comments: {
          where: { verified: true }, // فقط کامنت‌های تایید شده
        },
      },
    });
    return NextResponse.json(products);
  } catch (err) {
    console.error("❌ خطا در دریافت محصولات:", err);
    return NextResponse.json(
      { error: "خطا در دریافت محصولات" },
      { status: 500 }
    );
  }
}
