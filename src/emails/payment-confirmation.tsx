import { Layout } from "@/emails/components/layout";
import { Introduction } from "@/emails/components/introduction";
import { Product } from "@/emails/components/product";
import { OrderInformation } from "@/emails/components/order-information";
import { Footer, FooterProps } from "@/emails/components/footer";

const products = [
  {
    name: "Print J-Hope Mama 2022",
    quantity: 2,
    size: "Print A6 (14,5 x 10 aproximadamente)",
    thumbnail: "/images/products/print-j-hope-mama-2022.png",
  },
  {
    name: "Print J-Hope On The Street",
    quantity: 1,
    size: "Print A6 (14,5 x 10 aproximadamente)",
    thumbnail: "/images/products/print-j-hope-on-the-street.png",
  },
];

type PaymentConfirmationProps = {
  footer: FooterProps;
};

export const PaymentConfirmation = ({ footer }: PaymentConfirmationProps) => (
  <Layout preview="O Pagamento foi aprovado! 🤩🫰">
    <Introduction
      title="O Pagamento foi aprovado!"
      subtitle="Agora vamos enviar seu pedido. Em até dois dias úteis você receberá o código de rastreio. 🤩🫰"
    />
    {products.map((product) => (
      <Product key={product.thumbnail} {...product} />
    ))}
    <OrderInformation
      orderCode="#00001"
      orderDate="02/06/2023"
      orderDetailsUrl="#"
    />
    <Footer {...footer} />
  </Layout>
);

export default PaymentConfirmation;
