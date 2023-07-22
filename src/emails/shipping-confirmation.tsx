import { Layout, LayoutProps } from "./components/layout";
import { Tracking, TrackingProps } from "./components/tracking";
import { Introduction, IntroductionProps } from "./components/introduction";
import { Destination, DestinationProps } from "./components/destination";
import { Product, ProductProps } from "./components/product";
import {
  OrderInformation,
  OrderInformationProps,
} from "./components/order-information";
import { Footer, FooterProps } from "./components/footer";

export interface ShippingConfirmationProps {
  config: Omit<LayoutProps, "children">;
  tracking: TrackingProps;
  introduction: IntroductionProps;
  destination: DestinationProps;
  products: ProductProps[];
  orderInformation: OrderInformationProps;
  footer: FooterProps;
}

export const ShippingConfirmation = ({
  config,
  tracking,
  introduction,
  destination,
  products,
  orderInformation,
  footer,
}: ShippingConfirmationProps) => (
  <Layout {...config}>
    <Tracking {...tracking} />
    <Introduction {...introduction} />
    <Destination {...destination} />
    {products.map((product) => (
      <Product key={product.thumbnail} {...product} />
    ))}
    <OrderInformation {...orderInformation} />
    <Footer {...footer} />
  </Layout>
);
