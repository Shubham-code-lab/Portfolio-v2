import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const icon  = isDarkMode ? '🌙' : '☀️';
  const label = isDarkMode ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <ToggleButton onClick={toggleTheme} aria-label={label} aria-pressed={isDarkMode}>
      <ToggleCircle $isDark={isDarkMode}>{icon}</ToggleCircle>
    </ToggleButton>
  );
};

export default ThemeToggle;

const ToggleButton = styled.button`
  width: 5.2rem;
  height: 2.6rem;
  border-radius: 26px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.surfaceElevated};
  cursor: pointer;
  position: relative;
  flex-shrink: 0;
  padding: 0;
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.2s ease;
  box-shadow: 0 2px 6px ${({ theme }) => theme.shadow};

  &:hover {
    box-shadow: 0 4px 12px ${({ theme }) => theme.shadow};
  }
`;

const ToggleCircle = styled.div<{ $isDark: boolean }>`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.accent};
  position: absolute;
  top: 3px;
  left: ${({ $isDark }) => ($isDark ? '29px' : '3px')};
  transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  line-height: 1;
  box-shadow: 0 1px 4px ${({ theme }) => theme.shadow};
`;
