import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCardTransition } from '../contexts/CardTransitionContext';
import { useScrollDirection } from '../hooks/useScrollDirection';
import { NAVBAR_HEIGHT, Z_INDEX, BREAKPOINTS } from '../constants/layout';
import { homeFontFamily, spacing } from '../styles/theme';
import FlashlightMenu from '../components/FlashlightMenu/FlashlightMenu';
import ThemeToggle from './ThemeToggle';

/** Hide the navbar after the user has scrolled beyond the first viewport. */
const NAVBAR_HIDE_AFTER_VH_RATIO = 1;
const getHideThreshold = (): number =>
  typeof window === 'undefined' ? 800 : window.innerHeight * NAVBAR_HIDE_AFTER_VH_RATIO;

const Navbar = () => {
  const { isVisible }                        = useScrollDirection({ threshold: getHideThreshold() });
  const location                             = useLocation();
  const navigate                             = useNavigate();
  const { phase, setPhase, clearTransition } = useCardTransition();
  const [activeSection, setActiveSection]    = useState('Home');
  const displayedSection = location.pathname === '/home' ? activeSection : 'Project';

  useEffect(() => {
    if (location.pathname !== '/home') {
      return undefined;
    }

    let animationFrame = 0;

    const updateActiveSection = (): void => {
      animationFrame = 0;
      const sections = document.querySelectorAll<HTMLElement>('[data-nav-section]');
      const marker = window.innerHeight * 0.35;
      let nextSection = 'Home';
      let nextSectionId = 'home';

      sections.forEach(section => {
        if (section.getBoundingClientRect().top <= marker) {
          nextSection = section.dataset.navSection ?? nextSection;
          nextSectionId = section.id || nextSectionId;
        }
      });

      setActiveSection(previous => (previous === nextSection ? previous : nextSection));

      const nextHash = `#${nextSectionId}`;
      if (window.location.hash !== nextHash) {
        const nextUrl = `${window.location.pathname}${window.location.search}${nextHash}`;
        window.history.replaceState(window.history.state, '', nextUrl);
      }
    };

    const scheduleUpdate = (): void => {
      if (animationFrame !== 0) return;
      animationFrame = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (animationFrame !== 0) window.cancelAnimationFrame(animationFrame);
    };
  }, [location.pathname]);

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
    <>
      <NavbarContainer $isVisible={isVisible}>
        <Logo
          type="button"
          onClick={handleLogoClick}
          aria-label={`Go to home page; current section: ${displayedSection}`}
        >
          {displayedSection}
        </Logo>

        <RightControls>
          <FlashlightMenu navbarVisible={isVisible} />
        </RightControls>
      </NavbarContainer>

      <BlendActions $isVisible={isVisible}>
        <BlendControl>
          <ThemeToggle />
        </BlendControl>
        <ProjectButton type="button" data-cursor-label="[ interested? ]">
          <ProjectButtonSurface aria-hidden="true" />
          <ProjectButtonLabel>Start a project &rarr;</ProjectButtonLabel>
        </ProjectButton>
      </BlendActions>
    </>
  );
};

export default Navbar;

const NavbarContainer = styled.nav<{ $isVisible: boolean }>`
  position: fixed;
  left: 0;
  right: 0;
  height: ${NAVBAR_HEIGHT}px;
  font-family: ${homeFontFamily};
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${spacing.lg};
  z-index: ${Z_INDEX.navbar};
  top: ${({ $isVisible }) => ($isVisible ? '0' : `-${NAVBAR_HEIGHT}px`)};
  transition:
    top 0.35s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: ${BREAKPOINTS.mobile}) {
    padding: 0 ${spacing.sm};
  }
`;

const Logo = styled.button`
  appearance: none;
  border: 0;
  padding: 0;
  background: transparent;
  font-size: 2.2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.accent};
  letter-spacing: -0.5px;
  user-select: none;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.accent};
    outline-offset: 4px;
  }
`;

const RightControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

const BlendActions = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: ${({ $isVisible }) => ($isVisible ? '0' : `-${NAVBAR_HEIGHT}px`)};
  right: calc(${spacing.lg} + 4.4rem + 1.2rem);
  z-index: ${Z_INDEX.navbar + 1};
  height: ${NAVBAR_HEIGHT}px;
  font-family: ${homeFontFamily};
  display: flex;
  align-items: center;
  gap: 1.2rem;
  mix-blend-mode: difference;
  transition: top 0.35s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: ${BREAKPOINTS.mobile}) {
    right: calc(${spacing.sm} + 4.4rem + 1.2rem);
  }
`;

const BlendControl = styled.div`
  display: flex;
`;

const ProjectButton = styled.button`
  position: relative;
  display: inline-grid;
  place-items: center;
  height: 3.2rem;
  padding: 0 1.3rem;
  overflow: hidden;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: #000;
  font-size: 1.4rem;
  font-weight: 600;

  &:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 3px;
  }

  &:hover > span:first-child {
    transform: scale(calc(1 - 0.125em / 3.2rem));
  }

  @media (max-width: ${BREAKPOINTS.mobile}) {
    display: none;
  }
`;

const ProjectButtonSurface = styled.span`
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: #fff;
  transition: transform 600ms cubic-bezier(0.625, 0.05, 0, 1);
`;

const ProjectButtonLabel = styled.span`
  position: relative;
  z-index: 1;
  white-space: nowrap;
`;
