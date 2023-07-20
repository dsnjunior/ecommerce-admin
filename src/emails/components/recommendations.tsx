import { Section, Row, Column, Img, Text } from "@react-email/components";

import { paddingY, globals } from "../styles";
import { Divider } from "./divider";

export function Recommendations() {
  return (
    <>
      <Section style={paddingY}>
        <Text style={globals.heading}>Top Picks For You</Text>

        <Row style={recommendations.container}>
          <Column
            style={{ ...recommendations.product, paddingLeft: "4px" }}
            align="center"
          >
            <Img
              src={`/static/nike-recomendation-1.png`}
              alt="Brazil 2022/23 Stadium Away Women's Nike Dri-FIT Soccer Jersey"
              width="100%"
            />
            <Text style={recommendations.title}>
              USWNT 2022/23 Stadium Home
            </Text>
            <Text style={recommendations.text}>
              Women&apos;s Nike Dri-FIT Soccer Jersey
            </Text>
          </Column>
          <Column style={recommendations.product} align="center">
            <Img
              src={`/static/nike-recomendation-2.png`}
              alt="Brazil 2022/23 Stadium Away Women's Nike Dri-FIT Soccer Jersey"
              width="100%"
            />
            <Text style={recommendations.title}>
              Brazil 2022/23 Stadium Goalkeeper
            </Text>
            <Text style={recommendations.text}>
              Men&apos;s Nike Dri-FIT Short-Sleeve Football Shirt
            </Text>
          </Column>
          <Column style={recommendations.product} align="center">
            <Img
              src={`/static/nike-recomendation-4.png`}
              alt="Brazil 2022/23 Stadium Away Women's Nike Dri-FIT Soccer Jersey"
              width="100%"
            />
            <Text style={recommendations.title}>FFF</Text>
            <Text style={recommendations.text}>Women&apos;s Soccer Jacket</Text>
          </Column>
          <Column
            style={{ ...recommendations.product, paddingRight: "4px" }}
            align="center"
          >
            <Img
              src={`/static/nike-recomendation-4.png`}
              alt="Brazil 2022/23 Stadium Away Women's Nike Dri-FIT Soccer Jersey"
              width="100%"
            />
            <Text style={recommendations.title}>FFF</Text>
            <Text style={recommendations.text}>
              Women&apos;s Nike Pre-Match Football Top
            </Text>
          </Column>
        </Row>
      </Section>
      <Divider />
    </>
  );
}

const recommendationsText = {
  margin: "0",
  fontSize: "15px",
  lineHeight: "1",
  paddingLeft: "10px",
  paddingRight: "10px",
};

const recommendations = {
  container: {
    padding: "20px 0",
  },
  product: {
    verticalAlign: "top",
    textAlign: "left" as const,
    paddingLeft: "2px",
    paddingRight: "2px",
  },
  title: { ...recommendationsText, paddingTop: "12px", fontWeight: "500" },
  text: {
    ...recommendationsText,
    paddingTop: "4px",
    color: "#747474",
  },
};
