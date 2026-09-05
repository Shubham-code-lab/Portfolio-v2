import styled from 'styled-components';
import { buttonReset } from '../../styles/mixins';

interface Props {
  /** Visible label (also used as the accessible name). */
  label: string;
  /** Whether the button is currently revealed (controls opacity / lift-in). */
  visible: boolean;
  /** Click handler (caller is responsible for navigation / closing). */
  onClick: () => void;
  /** Stagger delay in ms applied to the entrance transition. */
  delayMs?: number;
}

/**
 * Pill button used inside the flashlight overlay. Reusable for any "ghost"
 * action surface: white-on-dark text, left+bottom shadow, accent fill on hover.
 */
export default function MenuButton({ label, visible, onClick, delayMs = 0 }: Props) {
  return (
    <Button type="button" onClick={onClick} $visible={visible} $delayMs={delayMs}>
      {label}
    </Button>
  );
}

interface StyledProps {
  $visible: boolean;
  $delayMs: number;
}

const restingTransform  = 'translateY(0)';
const hiddenTransform   = 'translateY(2rem)';
const hoverTransform    = 'translateY(-2px)';

const Button = styled.button<StyledProps>`
  ${buttonReset};
  padding: 1.2rem 2.2rem;
  font-size: 1.4rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  white-space: nowrap;
  color: ${({ theme }) => theme.flashlight.buttonText};
  border: 1px solid ${({ theme }) => theme.flashlight.buttonBorder};
  border-radius: 999px;
  background: transparent;
  /* Negative X = shadow on the left, positive Y = shadow on the bottom. */
  box-shadow: -8px 10px 22px ${({ theme }) => theme.flashlight.buttonShadow};

  opacity:   ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) => ($visible ? restingTransform : hiddenTransform)};
  transition:
    opacity      0.4s  ease ${({ $visible, $delayMs }) => ($visible ? `${$delayMs}ms` : '0ms')},
    transform    0.4s  ease ${({ $visible, $delayMs }) => ($visible ? `${$delayMs}ms` : '0ms')},
    background   0.25s ease,
    color        0.25s ease,
    border-color 0.25s ease;

  &:hover {
    background:   ${({ theme }) => theme.flashlight.buttonHoverBg};
    border-color: ${({ theme }) => theme.flashlight.buttonHoverBg};
    color:        ${({ theme }) => theme.flashlight.buttonHoverText};
    transform:    ${({ $visible }) => ($visible ? hoverTransform : hiddenTransform)};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.flashlight.buttonHoverBg};
    outline-offset: 3px;
  }
`;
