import { Section, Text, Row, Column, Link } from "@react-email/components";

import { paddingY, globals } from "../styles";
import { Divider } from "./divider";

export type FooterProps = {
  name: string;
  officialName: string;
  address: string;
  links: { label: string; url: string }[];
};

export function Footer({ address, name, officialName, links }: FooterProps) {
  return (
    <>
      <Section style={{ ...paddingY, backgroundColor: "rgb(195, 181, 253)" }}>
        <Text style={globals.heading}>
          look<span style={{ color: "#5b21b6" }}>here</span>.store
        </Text>
        <Row style={categories.container}>
          {links.map(({ label, url }) => (
            <Column key={label} align="center">
              <Link
                href={url}
                style={{
                  ...categories.text,
                  textDecoration: "underline",
                  textUnderlineOffset: 5,
                }}
              >
                {label}
              </Link>
            </Column>
          ))}
        </Row>
      </Section>
      <Divider />
      <Section style={paddingY}>
        <Text style={footer.text}>
          © {new Date().getFullYear()} {name}. Todos direitos reservados.
        </Text>
        <Text style={footer.text}>
          {officialName}. {address}
        </Text>
      </Section>
    </>
  );
}

const categories = {
  container: {
    width: "370px",
    margin: "auto",
    paddingTop: "12px",
  },
  text: {
    fontWeight: "500",
    color: "#000",
  },
};

const footer = {
  policy: {
    width: "166px",
    margin: "auto",
  },
  text: {
    margin: "0",
    color: "#000",
    fontSize: "13px",
    textAlign: "center",
  } as React.CSSProperties,
};
