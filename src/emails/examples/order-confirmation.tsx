import {
  OrderConfirmation,
  OrderConfirmationProps,
} from "../order-confirmation";
import { orderInformation, footer, products, introduction } from "./mocks";

const orderConfirmationExample: OrderConfirmationProps = {
  config: {
    preview: "Recebemos seu pedido! 😊🫰",
  },
  introduction: {
    ...introduction,
    title: "Recebemos seu pedido!",
    subtitle:
      "Quando o pagamento for processado voltaremos com mais informações. 😊🫰",
  },
  products: products,
  orderInformation,
  footer,
};

export default function OrderConfirmationExample() {
  return <OrderConfirmation {...orderConfirmationExample} />;
}
