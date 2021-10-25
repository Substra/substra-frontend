import { AlgoCategory, AlgoT } from './AlgosTypes';

export const CATEGORY_LABEL: Record<AlgoCategory, string> = {
    ALGO_SIMPLE: 'Simple',
    ALGO_AGGREGATE: 'Aggregate',
    ALGO_COMPOSITE: 'Composite',
};
export function getAlgoCategory(algo: AlgoT): string {
    return CATEGORY_LABEL[algo.category];
}
