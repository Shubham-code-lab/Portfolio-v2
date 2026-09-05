import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    background: string;
    surface: string;
    surfaceElevated: string;
    navBackground: string;

    text: string;
    textMuted: string;

    primary: {
      100: string;
      200: string;
      200_25: string;
      500: string;
      600: string;
    };

    accent: string;
    accentHover: string;
    accentDim: string;

    border: string;
    borderStrong: string;

    cardBg: string;
    shadow: string;
    gridLine: string;

    onAccent: string;
    scrim: string;

    flashlight: {
      handle:          string;
      handleLit:       string;
      handleLitText:   string;
      handleGlow:      string;
      beamColor:       string;
      floor:           string;
      buttonText:      string;
      buttonBorder:    string;
      buttonShadow:    string;
      buttonHoverBg:   string;
      buttonHoverText: string;
    };
  }
}
