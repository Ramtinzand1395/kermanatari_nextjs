import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

interface SpecificationItemInput {
  key: string;
  value: string;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const productId = Number(resolvedParams.id);

  if (isNaN(productId))
    return NextResponse.json(
      { error: "شناسه محصول نامعتبر است" },
      { status: 400 }
    );

  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ error: "کاربر وارد نشده" }, { status: 401 });
  if (session.user.role !== "superadmin")
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });

  try {
    const body = await req.json();
    const {
      title,
      slug,
      price,
      discountPrice,
      stock,
      brand,
      description,
      shortDesc,
      categoryId,
      mainImage,
      galleryImages,
      tags,
      specifications,
    } = body;

    // آپدیت محصول و تصاویر
    await prisma.product.update({
      where: { id: productId },
      data: {
        title,
        slug,
        price,
        discountPrice,
        stock,
        brand,
        description,
        shortDesc,
        categoryId,
        mainImage,
        images: {
          deleteMany: {},
          create: galleryImages.map((url: string) => ({ url })),
        },
      },
    });

    // آپدیت تگ‌ها
    await prisma.product.update({
      where: { id: productId },
      data: { tags: { set: [] } },
    });
    for (const tagName of tags) {
      await prisma.product.update({
        where: { id: productId },
        data: {
          tags: {
            connectOrCreate: {
              where: { slug: tagName.toLowerCase().replace(/\s+/g, "-") },
              create: {
                name: tagName,
                slug: tagName.toLowerCase().replace(/\s+/g, "-"),
              },
            },
          },
        },
      });
    }

    // آپدیت مشخصات
    const oldSpecs = await prisma.specification.findMany({
      where: { productId },
    });
    await prisma.specificationItem.deleteMany({
      where: { specificationId: { in: oldSpecs.map((s) => s.id) } },
    });
    await prisma.specification.deleteMany({ where: { productId } });
    for (const spec of specifications) {
      await prisma.specification.create({
        data: {
          title: spec.title,
          product: { connect: { id: productId } },
          items: {
            create: spec.items.map((item: SpecificationItemInput) => ({
              key: item.key,
              value: item.value,
            })),
          },
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "خطا در بروزرسانی محصول" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const productId = Number(resolvedParams.id);

  if (isNaN(productId)) {
    return NextResponse.json(
      { error: "شناسه محصول نامعتبر است" },
      { status: 400 }
    );
  }

  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "کاربر وارد نشده" }, { status: 401 });
  }

  if (session.user.role !== "superadmin") {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  try {
    // حذف تصاویر محصول
    await prisma.productImage.deleteMany({ where: { productId } });

    // حذف کامنت‌ها
    await prisma.comment.deleteMany({ where: { productId } });

    // حذف آیتم‌های مشخصات
    const specs = await prisma.specification.findMany({ where: { productId } });
    if (specs.length > 0) {
      await prisma.specificationItem.deleteMany({
        where: { specificationId: { in: specs.map((s) => s.id) } },
      });
      await prisma.specification.deleteMany({ where: { productId } });
    }

    // قطع ارتباط تگ‌ها
    await prisma.product.update({
      where: { id: productId },
      data: { tags: { set: [] } },
    });

    // حذف خود محصول
    await prisma.product.delete({ where: { id: productId } });

    return NextResponse.json({ message: "محصول و همه موارد مرتبط حذف شد" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "خطا در حذف محصول" }, { status: 500 });
  }
}
