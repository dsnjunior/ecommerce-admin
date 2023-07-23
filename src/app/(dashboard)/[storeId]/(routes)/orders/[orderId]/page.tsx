import { db } from "@/lib/db";
import { currencyFormat, dateTimeFormat } from "@/lib/utils";
import { ProductColumn } from "./components/columns";
import { ProductClient } from "./components/client";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { CustomerDetail } from "./components/customer-detail";

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

  const productsValue = order?.orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const formattedProducts: ProductColumn[] = order?.orderItems.map((item) => ({
    id: item.id,
    name: item.product.name,
    price: currencyFormat(item.price),
    category: item.product.category.name,
    size: item.product.size.name,
    color: item.product.color,
    quantity: item.quantity,
    createdAt: dateTimeFormat(item.createdAt),
  }));

  return (
    <ul>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <Heading title={`Order #${order.id}`} description="Order details" />
          <Separator />
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              <CustomerDetail
                label="Customer"
                value={`${order.name} ${order.surname}`}
              />
              <CustomerDetail label="Email" value={order.email} />
              <CustomerDetail label="Phone" value={order.phone} />
              <CustomerDetail label="CPF" value={order.cpf} />
              <CustomerDetail
                label="Delivery Deadline"
                value={dateTimeFormat(order.deliveryDeadline)}
              />

              <CustomerDetail
                label="Ordered at"
                value={dateTimeFormat(order.createdAt)}
              />
              <div className="col-span-2">
                <CustomerDetail
                  label="Address"
                  value={`${order.logradouro}, ${order.numero}. ${order.bairro} - ${order.localidade} - ${order.uf}`}
                />
              </div>
              <CustomerDetail label="Zip Code" value={order.destination} />
              <CustomerDetail
                label="Total"
                value={currencyFormat(order.shippingCost + productsValue)}
              />
              <CustomerDetail
                label="Shipping Cost"
                value={currencyFormat(order.shippingCost)}
              />
              <CustomerDetail
                label="Products Value"
                value={currencyFormat(productsValue)}
              />
            </div>
          </div>

          <Separator />

          <ProductClient data={formattedProducts} />
        </div>
      </div>
    </ul>
  );
};

export default OrderPage;
