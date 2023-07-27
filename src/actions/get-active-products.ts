import { db } from "@/lib/db";

const getActiveProducts = async (storeId: string) => {
  const activeProducts = await db.product.count({
    where: {
      storeId,
      isArchived: false,
    },
  });

  return activeProducts;
};

export default getActiveProducts;
