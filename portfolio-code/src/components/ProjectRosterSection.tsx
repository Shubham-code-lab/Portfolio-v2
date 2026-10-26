import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { CARDS } from '../data/cards';
import { homeFontFamily } from '../styles/theme';

const PREVIEW_WIDTH = 260;
const PREVIEW_HEIGHT = 360;
const POINTER_GAP = 56;
const VIEWPORT_GUTTER = 16;

export default function ProjectRosterSection() {
  const [hoveredTitle, setHoveredTitle] = useState<string | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewLayers, setPreviewLayers] = useState<[string, string]>([
    CARDS[0].image,
    CARDS[0].image,
  ]);
  const [activeLayer, setActiveLayer] = useState<0 | 1>(0);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const renderedRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let animationFrame = 0;

    const followPointer = (): void => {
      const preview = previewRef.current;
      const maxX = Math.max(VIEWPORT_GUTTER, window.innerWidth - PREVIEW_WIDTH - VIEWPORT_GUTTER);
      const maxY = Math.max(VIEWPORT_GUTTER, window.innerHeight - PREVIEW_HEIGHT - VIEWPORT_GUTTER);
      const targetX = Math.min(Math.max(pointerRef.current.x + POINTER_GAP, VIEWPORT_GUTTER), maxX);
      const targetY = Math.min(Math.max(pointerRef.current.y - PREVIEW_HEIGHT / 2, VIEWPORT_GUTTER), maxY);

      renderedRef.current.x += (targetX - renderedRef.current.x) * 0.22;
      renderedRef.current.y += (targetY - renderedRef.current.y) * 0.22;
      if (preview) {
        preview.style.transform = `translate3d(${renderedRef.current.x}px, ${renderedRef.current.y}px, 0)`;
      }
      animationFrame = window.requestAnimationFrame(followPointer);
    };

    animationFrame = window.requestAnimationFrame(followPointer);
    return () => window.cancelAnimationFrame(animationFrame);
  }, []);

  useEffect(() => {
    if (!hoveredTitle) return undefined;

    const clearDetachedHover = (): void => {
      const element = document.elementFromPoint(pointerRef.current.x, pointerRef.current.y);
      const row = element?.closest<HTMLElement>('[data-roster-row]');
      if (row?.dataset.rosterRow === hoveredTitle) return;
      setHoveredTitle(null);
      setPreviewVisible(false);
    };

    window.addEventListener('scroll', clearDetachedHover, { passive: true });
    return () => window.removeEventListener('scroll', clearDetachedHover);
  }, [hoveredTitle]);

  const updatePointer = (event: React.PointerEvent): void => {
    pointerRef.current = { x: event.clientX, y: event.clientY };
  };

  const showPreview = (title: string, image: string, event: React.PointerEvent): void => {
    updatePointer(event);
    setHoveredTitle(title);
    setPreviewLayers(previous => activeLayer === 0 ? [previous[0], image] : [image, previous[1]]);
    setActiveLayer(previous => previous === 0 ? 1 : 0);
    setPreviewVisible(true);
  };

  return (
    <RosterSection
      id="project-index"
      data-nav-section="Project Index"
      aria-labelledby="project-index-heading"
      onPointerMove={updatePointer}
      onPointerLeave={() => {
        setHoveredTitle(null);
        setPreviewVisible(false);
      }}
    >
      <PinnedInterface>
        <TopLine>
          <TopLabel id="project-index-heading">Project index</TopLabel>
          <Rule aria-hidden />
          <TopLabel>Works</TopLabel>
        </TopLine>

        <RosterTable>
          {CARDS.map((card, projectIndex) => (
            <ProjectRow
              key={card.title}
              to={`/project/${projectIndex}`}
              data-roster-row={card.title}
              data-cursor-label="[ view case ]"
              $active={hoveredTitle === card.title}
              onPointerEnter={event => showPreview(card.title, card.image, event)}
              onPointerLeave={() => {
                setHoveredTitle(null);
                setPreviewVisible(false);
              }}
            >
              <RowSummary>
                <RowNumber data-roster-number>
                  {String(projectIndex + 1).padStart(2, '0')}
                </RowNumber>
                <RowTitle>{card.title}</RowTitle>
                <RowCity>{card.tags[0]} / {card.year}</RowCity>
              </RowSummary>
              <RowDetails $active={hoveredTitle === card.title}>
                <RowDetailsInner>
                  <ProjectStatement>{card.desc}</ProjectStatement>
                  <DetailLine>
                    <span>Discipline</span>
                    <strong>{card.tags.join(' / ')}</strong>
                  </DetailLine>
                  <DetailLine>
                    <span>Release</span>
                    <strong>{card.year} · Case study {String(projectIndex + 1).padStart(2, '0')}</strong>
                  </DetailLine>
                </RowDetailsInner>
              </RowDetails>
            </ProjectRow>
          ))}
        </RosterTable>
      </PinnedInterface>

      <PortraitPreview ref={previewRef} $visible={previewVisible} aria-hidden="true">
        <PreviewImage src={previewLayers[0]} alt="" $visible={activeLayer === 0} />
        <PreviewImage src={previewLayers[1]} alt="" $visible={activeLayer === 1} />
        <PreviewCaption>{hoveredTitle}</PreviewCaption>
      </PortraitPreview>
    </RosterSection>
  );
}

const RosterSection = styled.section`
  position: relative;
  min-height: 100svh;
  color: #f7f4f2;
  background: #080808;
  font-family: ${homeFontFamily};
`;

const PinnedInterface = styled.div`
  position: relative;
  width: 100%;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  padding: clamp(2rem, 3vw, 4rem);
  overflow: hidden;
`;

const TopLine = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;
`;

const TopLabel = styled.span`
  flex: 0 0 auto;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
`;

const Rule = styled.span`
  height: 1px;
  flex: 1;
  background: rgba(255, 255, 255, 0.26);
`;

const RosterTable = styled.div`
  margin-top: clamp(2rem, 4vh, 4rem);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
`;

const ProjectRow = styled(Link)<{ $active: boolean }>`
  display: block;
  border-bottom: 1px solid rgba(255, 255, 255, 0.18);
  color: ${({ $active, theme }) => ($active ? theme.accent : '#fff')};
  transition: color 0.22s ease, background-color 0.22s ease;
  background: ${({ $active, theme }) => ($active ? `${theme.primary[200_25]}` : 'transparent')};
`;

const RowSummary = styled.div`
  min-height: clamp(4.2rem, 5.6svh, 5.6rem);
  display: grid;
  grid-template-columns: 6rem minmax(0, 1fr) auto;
  align-items: center;
  font-size: clamp(1.2rem, 1.25vw, 1.7rem);

  @media (max-width: 768px) {
    grid-template-columns: 4rem minmax(0, 1fr) auto;
  }
`;

const RowNumber = styled.span`
  font-size: 0.85rem;
  letter-spacing: 0.12em;
  color: currentColor;
  opacity: 0.66;
`;

const RowTitle = styled.span`
  min-width: 0;
  transition: transform 0.25s ease;

  ${ProjectRow}:hover & { transform: translateX(0.5rem); }
`;

const RowCity = styled.span`
  font-size: 0.85rem;
  letter-spacing: 0.12em;
  text-align: right;
  text-transform: uppercase;
  opacity: 0.72;
`;

const RowDetails = styled.div<{ $active: boolean }>`
  display: grid;
  grid-template-rows: ${({ $active }) => ($active ? '1fr' : '0fr')};
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  transition:
    grid-template-rows 0.32s cubic-bezier(0.2, 0.8, 0.2, 1),
    opacity 0.2s ease;
`;

const RowDetailsInner = styled.div`
  min-height: 0;
  overflow: hidden;
  padding: 0 0 1.3rem 6rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    padding-left: 4rem;
  }
`;

const ProjectStatement = styled.p`
  min-width: 0;
  margin: 0;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.78);
  font-size: 1rem;
  line-height: 1.5;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 0.35rem;
`;

const DetailLine = styled.p`
  min-width: 0;
  display: flex;
  gap: 1rem;
  margin: 0 0 0.2rem;
  font-size: 0.88rem;
  line-height: 1.4;

  span,
  strong {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    flex: 0 0 7.5rem;
    color: ${({ theme }) => theme.accent};
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  strong {
    color: rgba(255, 255, 255, 0.84);
    font-weight: 500;
  }
`;

const PortraitPreview = styled.div<{ $visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 40;
  width: ${PREVIEW_WIDTH}px;
  height: ${PREVIEW_HEIGHT}px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.32);
  border-radius: 0.8rem;
  background: #111;
  box-shadow: 0 2rem 6rem rgba(0, 0, 0, 0.42);
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
  pointer-events: none;
  transition: opacity 0.25s ease, visibility 0.25s ease;
  will-change: transform;

  @media (pointer: coarse) { display: none; }
`;

const PreviewImage = styled.img<{ $visible: boolean }>`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.35s ease;
`;

const PreviewCaption = styled.span`
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  left: 1rem;
  padding-top: 0.8rem;
  border-top: 1px solid rgba(255, 255, 255, 0.55);
  color: #fff;
  font-size: 0.9rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-shadow: 0 1px 8px #000;
`;
