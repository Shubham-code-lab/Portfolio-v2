import { useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import MainBackground from '../Ui/MainBackground';
import {
  MAX_CONTENT_WIDTH,
  FIRST_SECTION_HEIGHT,
  HERO_FIRST_SECTION_HEIGHT,
  HERO_STICKY_TOP_DESKTOP,
  HERO_STICKY_TOP_MOBILE,
  HERO_COPY_TRANSLATE_X_DESKTOP,
  HERO_COPY_TRANSLATE_X_MOBILE,
  HERO_COPY_RIGHT_GUTTER_DESKTOP,
  HERO_COPY_RIGHT_GUTTER_MOBILE,
  HERO_COPY_MARGIN_BOTTOM_DESKTOP,
  HERO_COPY_MARGIN_BOTTOM_MOBILE,
} from '../constants/layout';
import { homeFontFamily, spacing, typography } from '../styles/theme';
import { mq } from '../utils/mediaQueries';
import CardScroll from '../components/CardScroll';
import FeaturedWorkSection from '../components/FeaturedWorkSection';
import ClipReveal from '../components/ClipReveal';
import CursorReveal from '../components/CursorReveal';
import HeroDesertScene from '../components/HeroDesertScene';
import ScrollUpText from '../components/ScrollUpText';
import VisionSection from '../components/VisionSection';
import ProjectRosterSection from '../components/ProjectRosterSection';
import studioBackdropImage from '../assets/majestic-mountain-peak-tranquil-winter-landscape-generated-by-ai.jpg';

interface HeroCopy {
  title:    React.ReactNode;
  body:     string;
}

const HERO_NORMAL: HeroCopy = {
  title: (
    <>
      <span className="pixel-title-line" data-cursor-typography>
        Crafting digital
      </span>
      <span className="pixel-title-line" data-cursor-typography>
        experiences
      </span>
    </>
  ),
  body:  'A focused builder of high-quality interfaces — obsessed with the details that make digital products feel alive.',
};

const HERO_REVEAL: HeroCopy = {
  title: (
    <>
      <span className="pixel-title-line" data-cursor-typography>
        Breaking creative
      </span>
      <span className="pixel-title-line" data-cursor-typography>
        boundaries
      </span>
    </>
  ),
  body:  'Hover anywhere in this area — the circle follows your cursor and reveals a parallel version of the truth.',
};

const STUDIO_COORDINATES = `35.1709° N, 136.8815° E`;

function HeroBlock({ copy }: { copy: HeroCopy }) {
  return (
    <HeroStickyContent>
      <GroundRow>
        <TypographyDepth>
          <TypographyBlock>
            <Hero>{copy.title}</Hero>
            <Text>
              <span data-cursor-typography>{copy.body}</span>
            </Text>
          </TypographyBlock>
        </TypographyDepth>
      </GroundRow>
    </HeroStickyContent>
  );
}

export default function Home() {
  const studioSectionRef = useRef<HTMLElement | null>(null);
  const studioImageRef = useRef<HTMLImageElement | null>(null);
  const heroNormalNode = useMemo(() => <HeroBlock copy={HERO_NORMAL} />, []);
  const heroRevealNode = useMemo(() => (
    <RevealHeroVariant>
      <RevealSceneLayer>
        <HeroDesertScene cloudsOnly />
      </RevealSceneLayer>
      <RevealCopyLayer>
        <HeroBlock copy={HERO_REVEAL} />
      </RevealCopyLayer>
    </RevealHeroVariant>
  ), []);

  useEffect(() => {
    let rafId: number | null = null;

    const handleStudioImageOffset = () => {
      const sectionElement = studioSectionRef.current;
      const imageElement = studioImageRef.current;
      const viewportHeight = window.innerHeight;
      const maxOffsetPx = 80;

      if (!sectionElement || !imageElement || viewportHeight <= 0) {
        return;
      }

      const sectionBounds = sectionElement.getBoundingClientRect();
      const travelDistance = viewportHeight + sectionBounds.height;
      const scrollProgress = (viewportHeight - sectionBounds.top) / travelDistance;
      const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
      const mappedOffsetPx = Math.round((clampedProgress - 0.5) * maxOffsetPx * 2);

      imageElement.style.transform = `translate3d(0, ${mappedOffsetPx}px, 0) scale(1.05)`;
      rafId = null;
    };

    const requestStudioImageOffset = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(handleStudioImageOffset);
    };

    handleStudioImageOffset();
    window.addEventListener('scroll', requestStudioImageOffset, { passive: true });
    window.addEventListener('resize', requestStudioImageOffset);

    return () => {
      window.removeEventListener('scroll', requestStudioImageOffset);
      window.removeEventListener('resize', requestStudioImageOffset);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <MainBackground>
      <FirstSection id="home" data-nav-section="Home" data-cursor-state="move">
        <HeroStickyViewport>
          <HeroCanvas aria-hidden>
            <HeroDesertScene />
          </HeroCanvas>
          <HeroRevealMount>
            <FirstSectionReveal
              revealOnlyOnTypography
              normal={heroNormalNode}
              reveal={heroRevealNode}
            />
          </HeroRevealMount>
        </HeroStickyViewport>
      </FirstSection>

      <Content>
        <StudioShowcaseSection id="about" data-nav-section="About" ref={studioSectionRef}>
          <StudioCopy>
            <StudioEyebrow>[About the Studio]</StudioEyebrow>
            <StudioLead>
              Crafting digital experiences through design and frontend.
            </StudioLead>
            <StudioDescription>
              A designer and developer focused on building products that are both
              beautiful and functional. From concept to production, every detail
              matters.
            </StudioDescription>
            <StudioMeta>Creative web studio based in Aichi, Japan.</StudioMeta>
            <StudioInlineLink href="/about">View About</StudioInlineLink>
          </StudioCopy>

          <StudioVisualFrame>
            <StudioVisualImage
              ref={studioImageRef}
              src={studioBackdropImage}
              alt="Mountain landscape behind studio location card"
              loading="lazy"
            />
            <StudioInsetCard>
              <StudioInsetCoordinates>{STUDIO_COORDINATES}</StudioInsetCoordinates>
              <StudioInsetHeadline>
                Based in
                <strong>Aichi, Japan</strong>
              </StudioInsetHeadline>
              <StudioInsetSince>Since &rsquo;26</StudioInsetSince>
            </StudioInsetCard>
          </StudioVisualFrame>
        </StudioShowcaseSection>

      </Content>

      <VisionSection />

      <CardScroll />

      <FullWidthContent>
        <FeaturedWorkSection />
      </FullWidthContent>

      <ProjectRosterSection />

      <FullWidthContent>
        <Section id="process" data-nav-section="Process">
          <SectionTitle>new title</SectionTitle>
          <ClipReveal />
        </Section>

        <TrailingTitle>new title</TrailingTitle>
      </FullWidthContent>

      <ScrollUpText />
    </MainBackground>
  );
}

const Content = styled.div`
  box-sizing: border-box;
  width: 100%;
  max-width: ${MAX_CONTENT_WIDTH}px;
  margin-inline: auto;
  padding-inline: 0;
  display: flex;
  flex-direction: column;
  gap: 5rem;
`;

const FullWidthContent = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding-inline: 20px;
  display: flex;
  flex-direction: column;
  gap: 5rem;
`;

const FirstSection = styled.div`
  position: relative;
  height: ${HERO_FIRST_SECTION_HEIGHT};
  overflow-x: clip;
  background: transparent;
`;

/**
 * One sticky viewport for the whole hero: desert + ground stick here, and the
 * copy sits in the same box so it pins for the full hero scroll range.
 */
const HeroStickyViewport = styled.div`
  position: sticky;
  top: ${HERO_STICKY_TOP_DESKTOP}px;
  z-index: 0;
  width: 100%;
  height:     calc(100dvh - ${HERO_STICKY_TOP_DESKTOP}px);
  min-height: calc(100dvh - ${HERO_STICKY_TOP_DESKTOP}px);

  ${mq.mobile} {
    top: ${HERO_STICKY_TOP_MOBILE}px;
    height:     calc(100dvh - ${HERO_STICKY_TOP_MOBILE}px);
    min-height: calc(100dvh - ${HERO_STICKY_TOP_MOBILE}px);
  }
`;

const HeroCanvas = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
`;

const HeroRevealMount = styled.div`
  position: absolute;
  inset: 0;
  z-index: 4;
  min-height: 100%;
  pointer-events: auto;
`;

const FirstSectionReveal = styled(CursorReveal)`
  display: block;
  height: 100%;
  min-height: 100%;
`;

const HeroStickyContent = styled.div`
  position: relative;
  flex: 1;
  width: 100%;
  max-width: min(
    ${MAX_CONTENT_WIDTH}px,
    calc(100% - ${HERO_COPY_RIGHT_GUTTER_DESKTOP}px)
  );
  margin: 0 auto 0 0;
  margin-bottom: ${HERO_COPY_MARGIN_BOTTOM_DESKTOP}px;
  box-sizing: border-box;
  min-height: 100%;
  height: 100%;
  padding: 0;
  transform: translateX(${HERO_COPY_TRANSLATE_X_DESKTOP}px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  color: ${({ theme }) => theme.text};

  ${mq.mobile} {
    max-width: min(
      ${MAX_CONTENT_WIDTH}px,
      calc(100% - ${HERO_COPY_RIGHT_GUTTER_MOBILE}px)
    );
    margin-bottom: ${HERO_COPY_MARGIN_BOTTOM_MOBILE}px;
    transform: translateX(${HERO_COPY_TRANSLATE_X_MOBILE}px);
  }
`;

const GroundRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-start;
  width: 100%;
`;

/** Flat layout: an old 3D plane could paint behind the page and hide the headline. */
const TypographyDepth = styled.div`
  flex: 1;
  min-width: 0;
  max-width: 72rem;
  position: relative;
  z-index: 1;
  contain: layout;
  filter: drop-shadow(-5px 8px 14px ${({ theme }) => theme.shadow});
`;

const TypographyBlock = styled.div`
  position: relative;
  max-width: 72rem;
`;

const Hero = styled.h1`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: ${typography.hero.size};
  font-weight: ${typography.hero.weight};
  line-height: ${typography.hero.lineHeight};
  margin-bottom: ${spacing.md};
  min-height: calc(${typography.hero.lineHeight}em * 2);
  max-width: 100%;
  --pixel-title-shadow-1: ${({ theme }) => theme.accent};
  --pixel-title-shadow-2: ${({ theme }) => theme.borderStrong};
  --pixel-title-shadow-3: ${({ theme }) => theme.shadow};
  color: ${({ theme }) => theme.text};
  font-family: ${homeFontFamily};
  text-transform: uppercase;
  text-shadow:
    -0.055em 0.055em 0 var(--pixel-title-shadow-1),
    -0.11em 0.11em 0 var(--pixel-title-shadow-2),
    -0.165em 0.165em 0 var(--pixel-title-shadow-3),
    -0.22em 0.22em 0 rgba(0, 0, 0, 0.12);
  filter: drop-shadow(-0.12em 0.16em 0 rgba(0, 0, 0, 0.18));

  .pixel-title-line {
    position: relative;
    display: inline-block;
    width: max-content;
    max-width: 100%;
    overflow-wrap: normal;
    hyphens: manual;
    color: inherit;
    -webkit-text-fill-color: currentColor;
  }

  ${mq.tablet} { font-size: 6rem; }
  ${mq.mobile} {
    font-size: 3.8rem;
    margin-bottom: ${spacing.sm};
  }
`;

const RevealHeroVariant = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100%;
`;

const RevealSceneLayer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  filter: saturate(1.2) brightness(1.12);
`;

const RevealCopyLayer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
`;

const Text = styled.p`
  position: relative;
  width: fit-content;
  font-size: ${typography.large.size};
  line-height: ${typography.large.lineHeight};
  max-width: 64rem;
  --pixel-body-shadow-1: ${({ theme }) => theme.borderStrong};
  --pixel-body-shadow-2: ${({ theme }) => theme.shadow};
  color: ${({ theme }) => theme.textMuted};
  font-family: ${homeFontFamily};
  letter-spacing: 0;
  text-shadow:
    -0.04em 0.04em 0 var(--pixel-body-shadow-1),
    -0.08em 0.08em 0 var(--pixel-body-shadow-2);

  ${mq.mobile} { font-size: 1.7rem; }
`;

const Section = styled.div`
  margin: 0;
  height: ${FIRST_SECTION_HEIGHT};
`;

const SectionTitle = styled.h2`
  width: 100%;
  margin: 0 0 2rem;
  padding-block: 1.4rem;
  border-top: 1px solid ${({ theme }) => theme.border};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  font-size: clamp(4rem, 8vw, 10rem);
  font-weight: ${typography.h2.weight};
  line-height: 0.9;
  letter-spacing: -0.055em;
  text-transform: uppercase;

  ${mq.mobile} {
    font-size: clamp(3.2rem, 14vw, 6rem);
    margin-bottom: ${spacing.md};
  }
`;

const TrailingTitle = styled(SectionTitle)`
  margin-top: 0;
`;

const StudioShowcaseSection = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.65fr);
  align-items: center;
  gap: clamp(${spacing.xl}, 5vw, 4.8rem);
  margin: 0;

  ${mq.tablet} {
    grid-template-columns: 1fr;
    align-items: stretch;
    gap: ${spacing.xl};
  }
`;

const StudioCopy = styled.div`
  max-width: min(48rem, 100%);
  padding-right: clamp(0rem, 3vw, ${spacing.lg});
`;

const StudioEyebrow = styled.p`
  font-size: ${typography.body.size};
  line-height: ${typography.body.lineHeight};
  margin-bottom: ${spacing.sm};
  color: ${({ theme }) => theme.textMuted};
`;

const StudioLead = styled.p`
  font-size: clamp(2.4rem, 2.8vw, 3.6rem);
  line-height: 1.12;
  font-weight: ${typography.h2.weight};
  margin: 0 0 ${spacing.md};
  color: ${({ theme }) => theme.text};
`;

const StudioDescription = styled.p`
  font-size: ${typography.large.size};
  line-height: ${typography.large.lineHeight};
  margin: 0 0 ${spacing.md};
  color: ${({ theme }) => theme.textMuted};
`;

const StudioMeta = styled.p`
  font-size: ${typography.body.size};
  line-height: ${typography.body.lineHeight};
  margin: 0 0 ${spacing.md};
  color: ${({ theme }) => theme.textMuted};
`;

const StudioInlineLink = styled.a`
  display: inline-block;
  font-size: ${typography.body.size};
  line-height: ${typography.body.lineHeight};
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  border-bottom: 1px solid ${({ theme }) => theme.borderStrong};
  padding-bottom: 0.3rem;
  transition: color 0.25s ease, border-color 0.25s ease;

  &:hover,
  &:focus-visible {
    color: ${({ theme }) => theme.accent};
    border-color: ${({ theme }) => theme.accent};
  }
`;

const StudioVisualFrame = styled.div`
  position: relative;
  width: 100%;
  min-height: 56rem;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};

  ${mq.tablet} {
    min-height: 50rem;
  }

  ${mq.mobile} {
    min-height: 40rem;
  }
`;

const StudioVisualImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  transform: translate3d(0, 0, 0) scale(1.05);
  will-change: transform;
  backface-visibility: hidden;
  z-index: 0;
  pointer-events: none;
`;

const StudioInsetCard = styled.div`
  position: absolute;
  top: 10%;
  right: 8%;
  z-index: 1;
  width: min(22rem, 44%);
  padding: ${spacing.md};
  background: ${({ theme }) => theme.surfaceElevated};
  border: 1px solid ${({ theme }) => theme.borderStrong};
  box-shadow: 0 1rem 2rem ${({ theme }) => theme.shadow};
`;

const StudioInsetCoordinates = styled.p`
  font-size: 1.2rem;
  letter-spacing: 0.03em;
  margin-bottom: ${spacing.sm};
  color: ${({ theme }) => theme.textMuted};
`;

const StudioInsetHeadline = styled.p`
  font-size: clamp(2.2rem, 2.4vw, 3.8rem);
  line-height: 1.05;
  margin: 0;
  color: ${({ theme }) => theme.textMuted};
  font-weight: ${typography.h2.weight};

  strong {
    display: block;
    color: ${({ theme }) => theme.text};
    font-weight: ${typography.hero.weight};
  }
`;

const StudioInsetSince = styled.p`
  margin-top: ${spacing.sm};
  font-size: clamp(2rem, 2.2vw, 3.2rem);
  color: ${({ theme }) => theme.textMuted};
`;
