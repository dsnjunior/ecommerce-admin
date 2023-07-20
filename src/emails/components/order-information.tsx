import { Section, Row, Column, Link, Text } from "@react-email/components";

import { track, globals } from "../styles";
import { Divider } from "./divider";

export type OrderInformationProps = {
  orderCode: string;
  orderDate: string;
  orderDetailsUrl: string;
};

export function OrderInformation({
  orderCode,
  orderDate,
  orderDetailsUrl,
}: OrderInformationProps) {
  return (
    <>
      <Section style={globals.defaultPadding}>
        <Row style={{ display: "inline-flex", marginBottom: 40 }}>
          <Column style={{ width: "170px" }}>
            <Text style={globals.paragraphWithBold}>Código do pedido</Text>
            <Text style={track.code}>{orderCode}</Text>
          </Column>
          <Column>
            <Text style={globals.paragraphWithBold}>Data da compra</Text>
            <Text style={track.code}>{orderDate}</Text>
          </Column>
        </Row>
        <Row>
          <Column align="center">
            <Link style={globals.button} href={orderDetailsUrl}>
              Detalhes da compra
            </Link>
          </Column>
        </Row>
      </Section>
      <Divider />
    </>
  );
}
