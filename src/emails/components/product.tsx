import { Section, Row, Column, Img, Text } from "@react-email/components";

import { paddingX, globals, paragraph } from "../styles";
import { Divider } from "./divider";

export type ProductProps = {
  name: string;
  size: string;
  quantity: number | string;
  thumbnail: string;
};

export function Product({ name, quantity, size, thumbnail }: ProductProps) {
  return (
    <>
      <Section>
        <Row>
          <Column width="180px">
            <Img
              src={`${thumbnail}`}
              alt={name}
              style={{ float: "left" }}
              width="180px"
            />
          </Column>
          <Column
            style={{
              verticalAlign: "top",
              ...paddingX,
              paddingTop: "40px",
              paddingBottom: "40px",
            }}
          >
            <Text
              style={{ ...paragraph, fontWeight: "bold", fontSize: "16px" }}
            >
              {quantity} x {name}
            </Text>
            <Text style={globals.text}>{size}</Text>
          </Column>
        </Row>
      </Section>
      <Divider />
    </>
  );
}
