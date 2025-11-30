import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
interface SpecificationItemInput {
  key: string;
  value: string;
}

interface SpecificationInput {
  title: string;
  items: SpecificationItemInput[];
}

interface CreateProductBody {
  title: string;
  slug: string;
  price: number;
  discountPrice?: number | null;
  stock: number;
  brand: string;
  description: string;
  shortDesc: string;
  categoryId?: number | null;
  mainImage: string;
  galleryImages?: string[];
  specifications?: SpecificationInput[];
  tags?: string[];
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: true,
        specifications: {
          include: { items: true },
        },
        category: true,
        tags: true,
        comments: true,
      },
    });
    return NextResponse.json(products);
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "خطا در دریافت محصولات" },
      { status: 500 }
    );
  }
}

// یک تابع برای تولید SKU ساده
const generateSKU = () =>
  `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "کاربر وارد نشده" }, { status: 401 });
  }

  if (session.user.role !== "superadmin") {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  try {
    const body: CreateProductBody = await req.json();
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
      specifications,
      tags, // انتظار داریم این یک آرایه string باشد
    } = body;

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        price,
        discountPrice,
        stock,
        brand,
        description,
        shortDesc,
        // categoryId,
         categoryId: categoryId!,
        mainImage,
        sku: generateSKU(),
        images: {
          create: galleryImages?.map((img: string) => ({ url: img })),
        },
        specifications: {
          create: specifications?.map((spec) => ({
            title: spec.title,
            items: {
              create: spec.items.map((item) => ({
                key: item.key,
                value: item.value,
              })),
            },
          })),
        },
        tags: {
          connectOrCreate: tags?.map((tag: string) => ({
            where: { slug: tag.replace(/\s+/g, "-").toLowerCase() },
            create: { name: tag, slug: tag.replace(/\s+/g, "-").toLowerCase() },
          })),
        },
      },
    });

    return NextResponse.json(product);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "خطا در ایجاد محصول" }, { status: 500 });
  }
}
