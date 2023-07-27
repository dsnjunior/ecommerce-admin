import { db } from "@/lib/db";
import { Currency } from "@prisma/client";

const getTotalRevenue = async (storeId: string) => {
  const paidOrders = await db.order.findMany({
    where: {
      storeId,
      isPaid: true,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  const totalRevenue = paidOrders.reduce(
    (total: Map<Currency, number>, order) => {
      const orderTotal = order.orderItems.reduce((orderSum, item) => {
        return orderSum + item.price * item.quantity;
      }, 0);

      total.set(order.currency, (total.get(order.currency) ?? 0) + orderTotal);

      return total;
    },
    new Map()
  );

  return totalRevenue;
};

export default getTotalRevenue;
