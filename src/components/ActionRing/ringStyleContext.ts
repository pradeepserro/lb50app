import { createContext } from 'react';
import type { RingMetrics, RingStylesResult } from '@/components/ActionRing/ActionRing.styles';

export type RingStyleContextValue = Pick<RingStylesResult, 'bubbleStyles' | 'metrics'>;

export const RingStyleContext = createContext<RingStyleContextValue | null>(null);

export type { RingMetrics };
