import { paddingX, paddingY } from "./padding";
import { paragraph } from "./text";

export const globals = {
  paddingX,
  paddingY,
  defaultPadding: {
    ...paddingX,
    ...paddingY,
  },
  paragraphWithBold: { ...paragraph, fontWeight: 'bold' },
  heading: {
    fontSize: '32px',
    lineHeight: '1.3',
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: '-1px',
  } as React.CSSProperties,
  text: {
    ...paragraph,
    color: '#000',
    fontWeight: '500',
  },
  button: {
    border: '2px solid #000',
    fontSize: '16px',
    textDecoration: 'none',
    padding: '8px 16px',
    display: 'inline-block',
    textAlign: 'center',
    fontWeight: 500,
    color: '#fff',
    background: '#000',
  } as React.CSSProperties,
  hr: {
    borderColor: '#000',
    margin: '0',
    borderWidth: '2px',
  },
};
