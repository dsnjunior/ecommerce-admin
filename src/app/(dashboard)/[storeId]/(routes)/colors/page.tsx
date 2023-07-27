import { db } from "@/lib/db";
import { dateTimeFormat } from "@/lib/utils";

import { ColorColumn } from "./components/columns";
import { ColorClient } from "./components/client";

interface BillboardsPageProps {
  params: { storeId: string };
}

const BillboardsPage = async ({ params }: BillboardsPageProps) => {
  const colors = await db.color.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedColors: ColorColumn[] = colors.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    slug: item.slug,
    createdAt: dateTimeFormat(item.createdAt),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorClient data={formattedColors} />
      </div>
    </div>
  );
};

export default BillboardsPage;
