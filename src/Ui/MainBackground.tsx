import styled from 'styled-components';
import { NAVBAR_HEIGHT } from '../constants/layout';

const MainBackground = styled.div`
  min-height: 100vh;
  width: 100%;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.primary[500]};
  background-image:
    linear-gradient(${({ theme }) => theme.gridLine} 1px, transparent 1px),
    linear-gradient(90deg, ${({ theme }) => theme.gridLine} 1px, transparent 1px);
  background-size: 40px 40px;
  background-position: 0 0, 0 0;
  transition: background-color 0.3s ease, color 0.3s ease;
  padding-top: ${NAVBAR_HEIGHT}px;
  /* Belt-and-braces: never let any internal element create horizontal scroll. */
  overflow-x: clip;
`;

export default MainBackground;
