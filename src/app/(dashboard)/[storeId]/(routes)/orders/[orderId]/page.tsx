import { db } from "@/lib/db";
import { currencyFormat, dateTimeFormat } from "@/lib/utils";
import Image from "next/image";

interface OrdersPageProps {
  params: { storeId: string; orderId: string };
}

const OrderPage = async ({ params }: OrdersPageProps) => {
  const order = await db.order.findUnique({
    where: {
      id: params.orderId,
    },
    include: {
      orderItems: {
        include: {
          product: {
            include: {
              images: true,
              size: true,
              color: true,
              category: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    return null;
  }

  return (
    <ul>
      {order.orderItems.map((orderItem) => (
        <li key={orderItem.id}>
          <div className="relative h-20 w-20">
            <Image
              fill
              className="object-cover"
              alt="Image"
              src={orderItem.product.images[0].url}
            />
          </div>
          {orderItem.product.name} - {currencyFormat(orderItem.price)} x{" "}
          {orderItem.quantity}
        </li>
      ))}
    </ul>
  );
};

export default OrderPage;
