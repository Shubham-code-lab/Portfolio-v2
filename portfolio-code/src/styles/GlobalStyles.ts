import { createGlobalStyle } from 'styled-components';
import { typography } from './theme';

/**
 * Note: we intentionally do NOT apply a universal `transition` on `*`.
 * That used to cost a relayout/repaint on every hover and was the single
 * biggest paint cost in the app. Add transitions to specific elements only.
 */
const GlobalStyles = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  html, body {
    /* Stop any rogue child from creating a horizontal scrollbar (mobile safety). */
    overflow-x: clip;
    max-width: 100vw;
  }

  html {
    font-size: 62.5%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  :root {
    /* Exposed so non-themed surfaces (e.g. fade gradient stops) can read it. */
    --bg: ${({ theme }) => theme.background};
  }

  body {
    font-family: 'Poppins', sans-serif;
    color: ${({ theme }) => theme.primary[500]};
    background-color: ${({ theme }) => theme.background};
    min-height: 100vh;
    line-height: ${typography.body.lineHeight};
    font-size: ${typography.body.size};
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  input,
  button,
  textarea,
  select {
    font: inherit;
    color: inherit;
  }

  button { cursor: pointer; }
  *:disabled { cursor: not-allowed; }

  input:focus,
  button:focus,
  textarea:focus,
  select:focus {
    outline: 2px solid ${({ theme }) => theme.accent};
    outline-offset: -1px;
  }

  button:has(svg) { line-height: 0; }

  a { color: inherit; text-decoration: none; }
  ul { list-style: none; }

  p, h1, h2, h3, h4, h5, h6 {
    overflow-wrap: break-word;
    hyphens: auto;
  }

  img { max-width: 100%; }

  ::-webkit-scrollbar { width: 10px; height: 10px; }
  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.background};
    border-radius: 8px;
  }
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.border};
    border-radius: 8px;
    border: 2px solid ${({ theme }) => theme.background};
  }
  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.borderStrong};
  }

  * {
    scrollbar-width: thin;
    scrollbar-color: ${({ theme }) => theme.border} ${({ theme }) => theme.background};
  }

  ::selection {
    background: ${({ theme }) => theme.accentDim};
    color: ${({ theme }) => theme.accent};
  }
`;

export default GlobalStyles;
