import { Section, Text } from "@react-email/components";

import { globals, paragraph } from "../styles";
import { Divider } from "./divider";

export type DestinationProps = {
  clientName: string;
  clientAddress: string;
};

export function Destination({ clientAddress, clientName }: DestinationProps) {
  return (
    <>
      <Section
        style={{
          ...globals.defaultPadding,
          backgroundColor: "rgb(195, 181, 253)",
        }}
      >
        <Text style={addressTitle}>Enviado para: {clientName}</Text>
        <Text style={{ ...globals.text, fontSize: 14 }}>{clientAddress}</Text>
      </Section>
      <Divider />
    </>
  );
}

const addressTitle = {
  ...paragraph,
  fontSize: "15px",
  fontWeight: "bold",
};
