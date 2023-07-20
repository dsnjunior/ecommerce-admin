import { Section, Row, Column, Link, Text } from "@react-email/components";

import { globals, track } from "../styles";
import { Divider } from "./divider";

export type TrackingProps = {
  trackCode: string;
  trackUrl: string;
};

export function Tracking({ trackCode, trackUrl }: TrackingProps) {
  return (
    <>
      <Section style={track.container}>
        <Row>
          <Column>
            <Text style={globals.paragraphWithBold}>Código de rastreio</Text>
            <Text style={track.code}>{trackCode}</Text>
          </Column>
          <Column align="right">
            <Link style={globals.button} href={trackUrl}>
              Rastrear pacote
            </Link>
          </Column>
        </Row>
      </Section>
      <Divider />
    </>
  );
}
