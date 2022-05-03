import { useContext } from 'react';

import chakraTheme from '@/assets/chakraTheme';
import { PerfBrowserContext } from '@/hooks/usePerfBrowser';

interface ColorDiscriminant {
    computePlanKey: string;
    worker: string;
}

export const PERF_BROWSER_COLORSCHEMES = [
    'teal',
    'orange',
    'blue',
    'pink',
    'green',
    'yellow',
    'cyan',
    'red',
    'purple',
];

const usePerfBrowserColors = () => {
    const { colorMode, computePlans, nodes } = useContext(PerfBrowserContext);

    const getColorScheme = ({
        computePlanKey,
        worker,
    }: ColorDiscriminant): string => {
        let index = 0;
        if (colorMode === 'computePlan') {
            index = computePlans.findIndex(
                (computePlan) => computePlan.key === computePlanKey
            );
        } else {
            index = nodes.findIndex((node) => node.id === worker);
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
