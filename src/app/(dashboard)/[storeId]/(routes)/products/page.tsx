import { db } from "@/lib/db";

import { ProductColumn } from "./components/columns";
import { ProductClient } from "./components/client";
import { dateTimeFormat, currencyFormat } from "@/lib/utils";

interface ProductsPageProps {
  params: { storeId: string };
}

const ProductsPage = async ({ params }: ProductsPageProps) => {
  const products = await db.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      category: {
        select: {
          name: true,
        },
      },
      size: {
        select: {
          name: true,
        },
      },
      color: {
        select: {
          name: true,
          value: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    price: currencyFormat(item.price),
    category: item.category.name,
    size: item.size.name,
    color: item.color,
    isArchived: item.isArchived,
    isFeatured: item.isFeatured,
    createdAt: dateTimeFormat(item.createdAt),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
