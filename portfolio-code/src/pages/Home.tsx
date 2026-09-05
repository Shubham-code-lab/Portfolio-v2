import { useEffect, useMemo, useRef, useState } from 'react';
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
import { spacing, typography } from '../styles/theme';
import { mq } from '../utils/mediaQueries';
import { sandstoneBodyShadow, sandstoneTextShadow } from '../styles/mixins';
import CardScroll from '../components/CardScroll';
import FeaturedWorkSection from '../components/FeaturedWorkSection';
import ClipReveal from '../components/ClipReveal';
import CursorReveal from '../components/CursorReveal';
import HeroDesertScene from '../components/HeroDesertScene';
import ScrollUpText from '../components/ScrollUpText';
import studioBackdropImage from '../assets/majestic-mountain-peak-tranquil-winter-landscape-generated-by-ai.jpg';

interface HeroCopy {
  title:    React.ReactNode;
  body:     string;
}

const HERO_NORMAL: HeroCopy = {
  title: <>Crafting digital<br />experiences</>,
  body:  'A focused builder of high-quality interfaces — obsessed with the details that make digital products feel alive.',
};

const HERO_REVEAL: HeroCopy = {
  title: <>Breaking <HeroNoBreakInline>creative</HeroNoBreakInline><br />boundaries</>,
  body:  'Hover anywhere in this area — the circle follows your cursor and reveals a parallel version of the truth.',
};

const STUDIO_COORDINATES = `35.1709° N, 136.8815° E`;

/** Inline reference forwarded down because the styled element is declared at the bottom. */
function HeroNoBreakInline({ children }: { children: React.ReactNode }) {
  return <HeroNoBreak>{children}</HeroNoBreak>;
}

function HeroBlock({ copy }: { copy: HeroCopy }) {
  return (
    <HeroStickyContent>
      <GroundRow>
        <TypographyDepth>
          <TypographyBlock data-cursor-typography>
            <Hero>{copy.title}</Hero>
            <Text>{copy.body}</Text>
          </TypographyBlock>
        </TypographyDepth>
      </GroundRow>
    </HeroStickyContent>
  );
}

export default function Home() {
  const studioSectionRef = useRef<HTMLElement | null>(null);
  const heroNormalNode = useMemo(() => <HeroBlock copy={HERO_NORMAL} />, []);
  const heroRevealNode = useMemo(() => <HeroBlock copy={HERO_REVEAL} />, []);
  const [studioImageOffsetRem, setStudioImageOffsetRem] = useState(0);

  useEffect(() => {
    const handleStudioImageOffset = () => {
      const sectionElement = studioSectionRef.current;
      const viewportHeight = window.innerHeight;
      const maxOffsetRem = 5;

      if (!sectionElement || viewportHeight <= 0) {
        setStudioImageOffsetRem(0);
        return;
      }

      const sectionBounds = sectionElement.getBoundingClientRect();
      const travelDistance = viewportHeight + sectionBounds.height;
      const scrollProgress = (viewportHeight - sectionBounds.top) / travelDistance;
      const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
      const mappedOffsetRem = (clampedProgress - 0.5) * maxOffsetRem * 2;

      setStudioImageOffsetRem(mappedOffsetRem);
    };

    handleStudioImageOffset();
    window.addEventListener('scroll', handleStudioImageOffset, { passive: true });
    window.addEventListener('resize', handleStudioImageOffset);

    return () => {
      window.removeEventListener('scroll', handleStudioImageOffset);
      window.removeEventListener('resize', handleStudioImageOffset);
    };
  }, []);

  return (
    <MainBackground>
      <FirstSection>
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
        <StudioShowcaseSection ref={studioSectionRef}>
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
              src={studioBackdropImage}
              alt="Mountain landscape behind studio location card"
              loading="lazy"
              $offsetRem={studioImageOffsetRem}
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

        <FeaturedWorkSection />

        <Section>
          <SectionTitle>new title</SectionTitle>
          <ClipReveal />
        </Section>

        <CardScroll />

        <TrailingTitle>new title</TrailingTitle>
      </Content>

      <ScrollUpText />
    </MainBackground>
  );
}

const Content = styled.div`
  box-sizing: border-box;
  width: 100%;
  max-width: ${MAX_CONTENT_WIDTH}px;
  padding: 0 clamp(${spacing.lg}, 4vw, ${spacing.xxl});

  ${mq.mobile} {
    padding: 0 ${spacing.sm};
  }
`;

const FirstSection = styled.div`
  position: relative;
  height: ${HERO_FIRST_SECTION_HEIGHT};
  overflow-x: clip;
  background: ${({ theme }) => theme.background};
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

/** Keeps "creative" on one line so it never breaks awkwardly inside the hero title. */
const HeroNoBreak = styled.span`
  white-space: nowrap;
`;

const Hero = styled.h1`
  font-size: ${typography.hero.size};
  font-weight: ${typography.hero.weight};
  line-height: ${typography.hero.lineHeight};
  margin-bottom: ${spacing.md};
  min-height: calc(${typography.hero.lineHeight}em * 2);
  color: ${({ theme }) => theme.text};
  ${sandstoneTextShadow};

  ${mq.tablet} { font-size: 6rem; }
  ${mq.mobile} {
    font-size: 3.8rem;
    margin-bottom: ${spacing.sm};
  }
`;

const Text = styled.p`
  font-size: ${typography.large.size};
  line-height: ${typography.large.lineHeight};
  max-width: 64rem;
  color: ${({ theme }) => theme.textMuted};
  ${sandstoneBodyShadow};

  ${mq.mobile} { font-size: 1.7rem; }
`;

const Section = styled.div`
  margin: ${spacing.xxl} 0;
  height: ${FIRST_SECTION_HEIGHT};

  ${mq.mobile} { margin: ${spacing.xl} 0; }
`;

const SectionTitle = styled.h2`
  font-size: ${typography.h2.size};
  font-weight: ${typography.h2.weight};
  margin-bottom: ${spacing.md};

  ${mq.tablet} { font-size: 3.6rem; }
  ${mq.mobile} {
    font-size: 2.6rem;
    margin-bottom: ${spacing.sm};
  }
`;

const TrailingTitle = styled(SectionTitle)`
  margin-top: 8rem;
`;

const StudioShowcaseSection = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.65fr);
  align-items: center;
  gap: clamp(${spacing.xl}, 5vw, 4.8rem);
  margin: clamp(${spacing.xxl}, 8vw, 8rem) 0;

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

const StudioVisualImage = styled.img<{ $offsetRem: number }>`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  transform: translateY(${({ $offsetRem }) => `${$offsetRem}rem`}) scale(1.05);
  transition: transform 0.25s linear;
  will-change: transform;
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
