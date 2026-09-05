import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCardTransition } from '../contexts/CardTransitionContext';
import { useScrollDirection } from '../hooks/useScrollDirection';
import { NAVBAR_HEIGHT, NAVBAR_BLUR, Z_INDEX, BREAKPOINTS } from '../constants/layout';
import { spacing } from '../styles/theme';
import FlashlightMenu from '../components/FlashlightMenu/FlashlightMenu';
import ThemeToggle from './ThemeToggle';

/** Hide the navbar after the user has scrolled this far past the first viewport. */
const NAVBAR_HIDE_AFTER_VH_RATIO = 1;
const getHideThreshold = (): number =>
  typeof window === 'undefined' ? 800 : window.innerHeight * NAVBAR_HIDE_AFTER_VH_RATIO;

const Navbar = () => {
  const { isVisible }                        = useScrollDirection({ threshold: getHideThreshold() });
  const navigate                             = useNavigate();
  const { phase, setPhase, clearTransition } = useCardTransition();

  const handleLogoClick = useCallback((): void => {
    if (phase === 'landed') {
      // image is sitting on the detail page — fly it back then go home
      setPhase('flying-out');
    } else if (phase !== 'idle') {
      // mid-animation or transient state — just kill it cleanly
      clearTransition();
    }
    navigate('/home');
  }, [clearTransition, navigate, phase, setPhase]);

  return (
    <NavbarContainer $isVisible={isVisible}>
      <Logo onClick={handleLogoClick}>Logo</Logo>

      <RightControls>
        <ThemeToggle />
        <ConnectButton>Connect</ConnectButton>
        <FlashlightMenu navbarVisible={isVisible} />
      </RightControls>
    </NavbarContainer>
  );
};

export default Navbar;

const NavbarContainer = styled.nav<{ $isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: ${NAVBAR_HEIGHT}px;
  background: ${({ theme }) => theme.navBackground};
  backdrop-filter: blur(${NAVBAR_BLUR * 6}px) saturate(160%);
  -webkit-backdrop-filter: blur(${NAVBAR_BLUR * 6}px) saturate(160%);
  border-bottom: 1px solid ${({ theme }) => theme.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${spacing.lg};
  z-index: ${Z_INDEX.navbar};
  transform: translateY(${({ $isVisible }) => ($isVisible ? '0' : '-100%')});
  transition:
    transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    background 0.3s ease,
    border-color 0.3s ease;

  @media (max-width: ${BREAKPOINTS.mobile}) {
    padding: 0 ${spacing.sm};
  }
`;

const Logo = styled.div`
  font-size: 2.2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.accent};
  letter-spacing: -0.5px;
  cursor: pointer;
  user-select: none;
`;

const RightControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

const ConnectButton = styled.button`
  padding: 1rem 2.4rem;
  background: ${({ theme }) => theme.accent};
  color: ${({ theme }) => theme.onAccent};
  border: none;
  border-radius: 8px;
  font-size: 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
  box-shadow: 0 2px 8px ${({ theme }) => theme.shadow};

  &:hover {
    background: ${({ theme }) => theme.accentHover};
    transform: scale(1.04);
    box-shadow: 0 4px 16px ${({ theme }) => theme.shadow};
  }

  &:active {
    transform: scale(0.97);
  }

  @media (max-width: ${BREAKPOINTS.mobile}) {
    display: none;
  }
`;
