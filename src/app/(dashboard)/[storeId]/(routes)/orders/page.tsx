import { db } from "@/lib/db";
import { currencyFormat, dateTimeFormat } from "@/lib/utils";

import { OrderColumn } from "./components/columns";
import { OrderClient } from "./components/client";

interface OrdersPageProps {
  params: { storeId: string };
}

const OrdersPage = async ({ params }: OrdersPageProps) => {
  const orders = await db.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    destination: item.destination,
    isPaid: item.isPaid,
    products: item.orderItems
      .map((orderItem) => orderItem.product.name)
      .join(", "),
    totalPrice: currencyFormat(
      item.orderItems.reduce(
        (acc, orderItem) => acc + orderItem.product.price,
        0
      )
    ),
    createdAt: dateTimeFormat(item.createdAt),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
