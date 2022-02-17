import { useContext } from 'react';

import { isAverageNode } from '@/modules/nodes/NodesUtils';

import { PerfBrowserContext } from '@/hooks/usePerfBrowser';

import chakraTheme, { HAS_LIGHT_COLORSCHEME } from '@/assets/chakraTheme';

interface ColorDiscriminant {
    computePlanKey: string;
    worker: string;
}

export const PERF_BROWSER_COLORSCHEMES = HAS_LIGHT_COLORSCHEME;

const usePerfBrowserColors = () => {
    const { colorMode, sortedComputePlanKeys, nodes } =
        useContext(PerfBrowserContext);

    const getColorScheme = ({
        computePlanKey,
        worker,
    }: ColorDiscriminant): string => {
        let index = 0;
        if (colorMode === 'computePlan') {
            index = sortedComputePlanKeys.indexOf(computePlanKey);
        } else {
            if (isAverageNode(worker)) {
                return 'gray';
            }
            index = nodes.map((n) => n.id).indexOf(worker);
        }

        if (index === -1) {
            return 'teal';
        }
        return PERF_BROWSER_COLORSCHEMES[
            index % PERF_BROWSER_COLORSCHEMES.length
        ];
    };

    const getColor = (
        colorDiscriminant: ColorDiscriminant,
        intensity: string
    ): string => {
        return chakraTheme.colors[getColorScheme(colorDiscriminant)][intensity];
    };

    return {
        getColorScheme,
        getColor,
    };
};

export default usePerfBrowserColors;
