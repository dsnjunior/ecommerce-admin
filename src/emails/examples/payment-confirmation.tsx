import {
  PaymentConfirmation,
  PaymentConfirmationProps,
} from "../payment-confirmation";
import { orderInformation, footer, products, introduction } from "./mocks";

const paymentConfirmationExample: PaymentConfirmationProps = {
  config: {
    preview: "O Pagamento foi aprovado! 🤩🫰",
  },
  introduction: {
    ...introduction,
    title: "O Pagamento foi aprovado!",
    subtitle:
      "Agora vamos enviar seu pedido. Em até dois dias úteis você receberá o código de rastreio. 🤩🫰",
  },
  products,
  orderInformation,
  footer,
};

export default function PaymentConfirmationExample() {
  return <PaymentConfirmation {...paymentConfirmationExample} />;
}
