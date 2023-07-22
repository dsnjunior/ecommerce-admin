import { Section, Img, Heading, Text } from "@react-email/components";

import { globals, paddingY } from "../styles";
import { Divider } from "./divider";

export type IntroductionProps = {
  title: string;
  subtitle: string;
  description?: string;
  logo: string;
  storeName: string;
};

export function Introduction({
  logo,
  storeName,
  title,
  subtitle,
  description,
}: IntroductionProps) {
  return (
    <>
      <Section style={{ backgroundColor: "rgb(195, 181, 253)" }}>
        <Img
          src={logo}
          width="120"
          height="120"
          alt={storeName}
          style={{ margin: "auto" }}
        />
      </Section>
      <Divider />
      <Section style={message}>
        <Heading style={globals.heading}>{title}</Heading>
        <Text style={{ ...globals.text, fontSize: "20px" }}>{subtitle}</Text>
        {description && (
          <Text style={{ ...globals.text, marginTop: "20px" }}>
            {description}
          </Text>
        )}
      </Section>
      <Divider />
    </>
  );
}

const message = {
  padding: "20px 74px 40px",
  textAlign: "center",
} as React.CSSProperties;
