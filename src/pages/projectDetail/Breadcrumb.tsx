import styled from 'styled-components';
import CloseIcon from '../../components/svg/CloseIcon';
import { buttonReset, ellipsis } from '../../styles/mixins';

interface Props {
  currentLabel: string;
  onBack:       () => void;
}

export default function Breadcrumb({ currentLabel, onBack }: Props) {
  return (
    <Row>
      <Trail aria-label="breadcrumb">
        <Link onClick={onBack}>Home</Link>
        <Sep>/</Sep>
        <Link onClick={onBack}>Projects</Link>
        <Sep>/</Sep>
        <Current>{currentLabel}</Current>
      </Trail>

      <Close onClick={onBack} aria-label="Close">
        <CloseIcon />
      </Close>
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`;

const Trail = styled.nav`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Link = styled.button`
  ${buttonReset};
  font-size: 1.2rem;
  font-weight: 500;
  color: ${({ theme }) => theme.textMuted};
  letter-spacing: 0.01em;
  transition: color 0.15s;
  &:hover { color: ${({ theme }) => theme.text}; }
`;

const Sep = styled.span`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.textMuted};
  opacity: 0.4;
  user-select: none;
  margin: 0 1px;
`;

const Current = styled.span`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.primary[500]};
  letter-spacing: 0.01em;
  max-width: 20rem;
  ${ellipsis};
`;

const Close = styled.button`
  ${buttonReset};
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.border};
  background: transparent;
  color: ${({ theme }) => theme.textMuted};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.15s, color 0.15s, border-color 0.15s;

  svg { width: 1.2rem; height: 1.2rem; fill: currentColor; }

  &:hover {
    background: ${({ theme }) => theme.surfaceElevated};
    border-color: ${({ theme }) => theme.borderStrong};
    color: ${({ theme }) => theme.text};
  }
`;
