import { Section, Row, Column, Link, Text } from "@react-email/components";

import { track, globals } from "../styles";
import { Divider } from "./divider";

const formatter = Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "America/Sao_Paulo",
});

export type OrderInformationProps = {
  orderCode: string;
  orderDate: Date;
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
            <Text style={track.code}>{formatter.format(orderDate)}</Text>
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
