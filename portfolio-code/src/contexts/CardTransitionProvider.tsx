import { useCallback, useMemo, useState, type ReactNode } from 'react';
import type { CardData } from '../types/card';
import {
  CardTransitionContext,
  type CardTransitionState,
  type TransitionPhase,
} from './CardTransitionContext';

interface Props {
  children: ReactNode;
}

export function CardTransitionProvider({ children }: Props) {
  const [card,  setCard]  = useState<CardData | null>(null);
  const [rect,  setRect]  = useState<DOMRect  | null>(null);
  const [phase, setPhase] = useState<TransitionPhase>('idle');

  const setTransition = useCallback((nextCard: CardData, nextRect: DOMRect): void => {
    setCard(nextCard);
    setRect(nextRect);
  }, []);

  const clearTransition = useCallback((): void => {
    setCard(null);
    setRect(null);
    setPhase('idle');
  }, []);

  const value = useMemo<CardTransitionState>(() => ({
    card,
    rect,
    phase,
    setTransition,
    setPhase,
    clearTransition,
  }), [card, rect, phase, setTransition, clearTransition]);

  return (
    <CardTransitionContext.Provider value={value}>
      {children}
    </CardTransitionContext.Provider>
  );
}
