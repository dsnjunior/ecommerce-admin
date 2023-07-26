import { db } from "@/lib/db";
import { dateTimeFormat } from "@/lib/utils";

import { CategoryColumn } from "./components/columns";
import { CategoryClient } from "./components/client";

interface CategoriesPageProps {
  params: { storeId: string };
}

const CategoriesPage = async ({ params }: CategoriesPageProps) => {
  const categories = await db.category.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    billboardLabel: item.billboard.label,
    createdAt: dateTimeFormat(item.createdAt),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
