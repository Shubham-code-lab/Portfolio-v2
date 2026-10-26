import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styled from 'styled-components';
import visionImage from '../assets/majestic-mountain-peak-tranquil-winter-landscape-generated-by-ai.jpg';
import { BREAKPOINTS } from '../constants/layout';

const SLICE_COUNT = 6;

export default function VisionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const slicesRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const slicesContainer = slicesRef.current;
    const heading = headingRef.current;
    const paragraph = paragraphRef.current;

    if (!section || !slicesContainer || !heading || !paragraph) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const slices = gsap.utils.toArray<HTMLElement>(slicesContainer.children);
    const headingLines = gsap.utils.toArray<HTMLElement>(heading.querySelectorAll('[data-vision-line]'));

    if (reducedMotion) {
      gsap.set(slices, { scaleY: 0 });
      gsap.set([...headingLines, paragraph], {
        opacity: 1,
        filter: 'blur(0px)',
        yPercent: 0,
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      gsap.set(slices, { scaleY: 1 });
      gsap.set([...headingLines, paragraph], {
        opacity: 0,
        filter: 'blur(20px)',
        yPercent: 100,
      });

      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          scrub: 1,
          end: 'center center',
          invalidateOnRefresh: true,
        },
      });

      timeline
        .to(slices, { scaleY: 0, duration: 1 }, 'reveal')
        .fromTo(
          headingLines,
          { opacity: 0, filter: 'blur(20px)', yPercent: 100 },
          { opacity: 1, filter: 'blur(0px)', yPercent: 0, duration: 0.65, stagger: 0.08 },
          'reveal+=0.5',
        )
        .fromTo(
          paragraph,
          { opacity: 0, filter: 'blur(20px)', yPercent: 100 },
          { opacity: 1, filter: 'blur(0px)', yPercent: 0, duration: 0.5 },
          'reveal+=0.7',
        )
        .to(
          section,
          { scale: 0.9, borderRadius: 24, force3D: true, duration: 0.55 },
          'reveal+=1',
        );
    }, section);

    return () => context.revert();
  }, []);

  return (
    <Section id="vision" data-nav-section="Vision" ref={sectionRef} aria-labelledby="vision-heading">
      <ImageFrame>
        <Image
          src={visionImage}
          alt="Snow-covered mountain peaks beneath a dramatic sky"
          width="1920"
          height="1080"
          loading="lazy"
        />
      </ImageFrame>

      <Overlay />

      <Slices ref={slicesRef} aria-hidden="true">
        {Array.from({ length: SLICE_COUNT }, (_, index) => <span key={index} />)}
      </Slices>

      <Content>
        <Heading id="vision-heading" ref={headingRef} aria-label="The vision behind the flow">
          <HeadingClip aria-hidden="true">
            <span data-vision-line>The vision</span>
          </HeadingClip>
          <HeadingClip aria-hidden="true">
            <span data-vision-line>behind the flow</span>
          </HeadingClip>
        </Heading>
        <Description ref={paragraphRef}>
          We believe in the power of real voices to shape how the world sees itself.
        </Description>
      </Content>
    </Section>
  );
}

const Section = styled.section`
  position: relative;
  width: 100%;
  min-height: 100vh;
  min-height: 100svh;
  overflow: hidden;
  display: grid;
  place-items: center;
  color: #fff;
  background: #000;
  transform-origin: center center;
  will-change: transform, border-radius;

  @media (prefers-reduced-motion: reduce) {
    transform: none !important;
    border-radius: 0 !important;
    will-change: auto;
  }
`;

const ImageFrame = styled.picture`
  position: absolute;
  inset: 0;
  z-index: 0;
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 0;
`;

const Image = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  max-width: none;
  object-fit: cover;
  object-position: center;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: rgba(0, 0, 0, 0.3);
`;

const Slices = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;

  > span {
    width: 100%;
    min-height: 0;
    flex-shrink: 1;
    background: #000;
    transform: scaleY(1);
    transform-origin: center top;
    will-change: transform;
  }

  > span:nth-last-of-type(1) { height: 100%; }
  > span:nth-last-of-type(2) { height: 50%; }
  > span:nth-last-of-type(3) { height: 33.3333%; }
  > span:nth-last-of-type(4) { height: 25%; }
  > span:nth-last-of-type(5) { height: 20%; }
  > span:nth-last-of-type(6) { height: 16.6667%; }

  @media (prefers-reduced-motion: reduce) {
    > span {
      transform: scaleY(0) !important;
      will-change: auto;
    }
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 3;
  width: min(92%, 108rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(2rem, 4vh, 4rem);
  text-align: center;
  pointer-events: none;
`;

const Heading = styled.h2`
  font-size: clamp(5.2rem, 9vw, 13rem);
  font-weight: 600;
  line-height: 0.9;
  letter-spacing: -0.055em;
  text-wrap: balance;

  @media (max-width: ${BREAKPOINTS.mobile}) {
    font-size: clamp(4.2rem, 14vw, 7rem);
    line-height: 0.95;
  }
`;

const HeadingClip = styled.span`
  display: block;
  overflow: hidden;

  > span {
    display: block;
    will-change: transform, opacity, filter;
  }

  @media (prefers-reduced-motion: reduce) {
    > span {
      opacity: 1 !important;
      filter: none !important;
      transform: none !important;
      will-change: auto;
    }
  }
`;

const Description = styled.p`
  max-width: 64rem;
  font-size: clamp(1.7rem, 2vw, 2.4rem);
  line-height: 1.5;
  text-wrap: balance;
  will-change: transform, opacity, filter;

  @media (max-width: ${BREAKPOINTS.mobile}) {
    max-width: 32rem;
  }

  @media (prefers-reduced-motion: reduce) {
    opacity: 1 !important;
    filter: none !important;
    transform: none !important;
    will-change: auto;
  }
`;
