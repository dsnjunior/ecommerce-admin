import {
  ShippingConfirmation,
  ShippingConfirmationProps,
} from "../shipping-confirmation";
import { orderInformation, footer, products, introduction } from "./mocks";

const shippingConfirmationExample: ShippingConfirmationProps = {
  config: {
    preview: "Seus produtos estão a caminho! 😎🫰",
  },
  tracking: {
    trackCode: "OG01234567890",
    trackUrl: "#",
  },
  introduction: {
    ...introduction,
    title: "Está a caminho!",
    subtitle: "Seu pedido foi enviado! 😎🫰",
  },
  destination: {
    clientAddress: "Amapá",
    clientName: "Daniel",
  },
  products,
  orderInformation,
  footer,
};

export default function ShippingConfirmationExample() {
  return <ShippingConfirmation {...shippingConfirmationExample} />;
}
