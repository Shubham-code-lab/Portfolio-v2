import { createContext, useContext } from 'react';
import type { CardData } from '../types/card';

export type TransitionPhase = 'idle' | 'flying-in' | 'landed' | 'flying-out';

export interface CardTransitionState {
  card:            CardData | null;
  rect:            DOMRect  | null;
  phase:           TransitionPhase;
  setTransition:   (card: CardData, rect: DOMRect) => void;
  setPhase:        (phase: TransitionPhase) => void;
  clearTransition: () => void;
}

const noop = (): void => {};

export const CardTransitionContext = createContext<CardTransitionState>({
  card:            null,
  rect:            null,
  phase:           'idle',
  setTransition:   noop,
  setPhase:        noop,
  clearTransition: noop,
});

export const useCardTransition = (): CardTransitionState =>
  useContext(CardTransitionContext);
