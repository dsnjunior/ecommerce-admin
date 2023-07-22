import { Layout, LayoutProps } from "./components/layout";
import { Introduction, IntroductionProps } from "./components/introduction";
import {
  OrderInformation,
  OrderInformationProps,
} from "./components/order-information";
import { Footer, FooterProps } from "./components/footer";

export interface DeliveryConfirmationProps {
  config: Omit<LayoutProps, "children">;
  introduction: IntroductionProps;
  orderInformation: OrderInformationProps;
  footer: FooterProps;
}

export const DeliveryConfirmation = ({
  config,
  introduction,
  footer,
  orderInformation,
}: DeliveryConfirmationProps) => (
  <Layout {...config}>
    <Introduction {...introduction} />
    <OrderInformation {...orderInformation} />
    <Footer {...footer} />
  </Layout>
);
