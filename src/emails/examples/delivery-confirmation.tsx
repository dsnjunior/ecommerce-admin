import {
  DeliveryConfirmation,
  DeliveryConfirmationProps,
} from "../delivery-confirmation";
import { footer, introduction, orderInformation } from "./mocks";

const deliveryConfirmationExample: DeliveryConfirmationProps = {
  config: {
    preview: "Seu pedido chegou! 😍🫰",
  },
  introduction: {
    ...introduction,
    title: "Seu pedido chegou!",
    subtitle: "Esperamos que esteja tudo certo.",
    description:
      "Caso tenha algum problema no pedido, alguma dúvida ou sugestão por favor entre em contato com a gente! 🫰",
  },
  orderInformation,
  footer,
};

export default function DeliveryConfirmationExample() {
  return <DeliveryConfirmation {...deliveryConfirmationExample} />;
}
