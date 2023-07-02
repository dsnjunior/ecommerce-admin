import { db } from "@/lib/db";

import { BillboardColumn } from "./components/columns";
import { BillboardClient } from "./components/client";

interface BillboardsPageProps {
  params: { storeId: string };
}

const BillboardsPage = async ({ params }: BillboardsPageProps) => {
  const billboards = await db.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: Intl.DateTimeFormat().format(item.createdAt),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  );
};

export default BillboardsPage;
