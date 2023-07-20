import { Section, Img, Heading, Text } from "@react-email/components";

import { globals } from "../styles";
import { Divider } from "./divider";

export type IntroductionProps = {
  title: string;
  subtitle: string;
  description?: string;
};

export function Introduction({
  title,
  subtitle,
  description,
}: IntroductionProps) {
  return (
    <>
      <Section style={message}>
        <Img
          src={`/email/look-here-logo.png`}
          width="66"
          height="22"
          alt=""
          style={{ margin: "auto" }}
        />
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
  padding: "40px 74px",
  textAlign: "center",
} as React.CSSProperties;
