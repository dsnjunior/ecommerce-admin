import { Layout, LayoutProps } from "./components/layout";
import { Introduction, IntroductionProps } from "./components/introduction";
import { Product, ProductProps } from "./components/product";
import {
  OrderInformation,
  OrderInformationProps,
} from "./components/order-information";
import { Footer, FooterProps } from "./components/footer";

export interface OrderConfirmationProps {
  config: Omit<LayoutProps, "children">;
  introduction: IntroductionProps;
  products: ProductProps[];
  orderInformation: OrderInformationProps;
  footer: FooterProps;
}

export const OrderConfirmation = ({
  config,
  introduction,
  orderInformation,
  footer,
  products,
}: OrderConfirmationProps) => (
  <Layout {...config}>
    <Introduction {...introduction} />
    {products.map((product) => (
      <Product key={product.thumbnail} {...product} />
    ))}
    <OrderInformation {...orderInformation} />
    <Footer {...footer} />
  </Layout>
);
