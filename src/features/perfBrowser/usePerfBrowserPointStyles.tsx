import { useCallback, useContext } from 'react';

import { IconType } from 'react-icons/lib';
import {
    RiCheckboxBlankFill,
    RiCloudy2Fill,
    RiHeartFill,
    RiPlayFill,
    RiSignalWifiFill,
    RiVipDiamondFill,
} from 'react-icons/ri';

import chakraTheme from '@/assets/chakraTheme';
import { PerfBrowserContext } from '@/features/perfBrowser/usePerfBrowser';
import { PERF_BROWSER_COLORSCHEMES } from '@/features/perfBrowser/usePerfBrowserColors';
import { SerieT } from '@/types/SeriesTypes';

const POINT_STYLE_ICONS = [
    'play',
    'checkbox-blank',
    'heart',
    'signal-wifi',
    'vip-diamond',
    'cloudy-2',
] as const;

type PointStyleIconT = typeof POINT_STYLE_ICONS[number];

const POINT_STYLE_ICON_COMPONENTS: Record<PointStyleIconT, IconType> = {
    play: RiPlayFill,
    'checkbox-blank': RiCheckboxBlankFill,
    heart: RiHeartFill,
    'signal-wifi': RiSignalWifiFill,
    'vip-diamond': RiVipDiamondFill,
    'cloudy-2': RiCloudy2Fill,
};

const DATA_URL_BUILDER: Record<PointStyleIconT, (color: string) => string> = {
    play: (color: string) =>
        `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M19.376 12.416L8.777 19.482A.5.5 0 0 1 8 19.066V4.934a.5.5 0 0 1 .777-.416l10.599 7.066a.5.5 0 0 1 0 .832z' fill='${color}'/%3E%3C/svg%3E`,
    'checkbox-blank': (color: string): string =>
        `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z' fill='${color}'/%3E%3C/svg%3E`,
    heart: (color: string) =>
        `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0H24V24H0z'/%3E%3Cpath d='M12.001 4.529c2.349-2.109 5.979-2.039 8.242.228 2.262 2.268 2.34 5.88.236 8.236l-8.48 8.492-8.478-8.492c-2.104-2.356-2.025-5.974.236-8.236 2.265-2.264 5.888-2.34 8.244-.228z' fill='${color}'/%3E%3C/svg%3E`,
    'signal-wifi': (color: string) =>
        `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0H24V24H0z'/%3E%3Cpath d='M12 3c4.284 0 8.22 1.497 11.31 3.996L12 21 .69 6.997C3.78 4.497 7.714 3 12 3z' fill='${color}'/%3E%3C/svg%3E`,
    'vip-diamond': (color: string) =>
        `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M4.873 3h14.254a1 1 0 0 1 .809.412l3.823 5.256a.5.5 0 0 1-.037.633L12.367 21.602a.5.5 0 0 1-.734 0L.278 9.302a.5.5 0 0 1-.037-.634l3.823-5.256A1 1 0 0 1 4.873 3z' fill='${color}'/%3E%3C/svg%3E`,
    'cloudy-2': (color: string) =>
        `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M17 21H7A6 6 0 0 1 5.008 9.339a7 7 0 1 1 13.984 0A6 6 0 0 1 17 21z' fill='${color}'/%3E%3C/svg%3E`,
};

const ALL_COLORS: string[] = PERF_BROWSER_COLORSCHEMES.reduce(
    (allColors: string[], themeColor: string): string[] => {
        return [
            ...allColors,
            // normal
            chakraTheme.colors[themeColor][500],
            // light
            chakraTheme.colors[themeColor][100],
        ];
    },
    []
);

const getImg = (icon: PointStyleIconT, color: string) => {
    const img = new Image(10, 10);
    img.src = DATA_URL_BUILDER[icon](color.replace('#', '%23'));
    return img;
};

const getAllImgs = (
    icon: PointStyleIconT
): Record<string, HTMLImageElement> => {
    const res: Record<string, HTMLImageElement> = {};
    for (const color of ALL_COLORS) {
        res[color] = getImg(icon, color);
    }
    return res;
};

const POINT_STYLES: Record<
    PointStyleIconT,
    Record<string, HTMLImageElement>
> = {
    play: getAllImgs('play'),
    'checkbox-blank': getAllImgs('checkbox-blank'),
    heart: getAllImgs('heart'),
    'signal-wifi': getAllImgs('signal-wifi'),
    'vip-diamond': getAllImgs('vip-diamond'),
    'cloudy-2': getAllImgs('cloudy-2'),
};

const usePerfBrowserPointStyles = () => {
    const { organizations } = useContext(PerfBrowserContext);

    const getPointStyleIcon = useCallback(
        (worker: string): PointStyleIconT | null => {
            const index = organizations.map((n) => n.id).indexOf(worker);

            if (index === -1) {
                return null;
            }

            return POINT_STYLE_ICONS[index % POINT_STYLE_ICONS.length];
        },
        [organizations]
    );

    const getPointStyleComponent = useCallback(
        (worker: string): IconType | null => {
            const icon = getPointStyleIcon(worker);
            if (icon === null) {
                return null;
            }
            return POINT_STYLE_ICON_COMPONENTS[icon];
        },
        [getPointStyleIcon]
    );

    const getPointStyle = useCallback(
        (serie: SerieT, color: string): HTMLImageElement | 'circle' => {
            const icon = getPointStyleIcon(serie.worker);
            if (icon === null) {
                return 'circle';
            }
            return POINT_STYLES[icon][color] || 'circle';
        },
        [getPointStyleIcon]
    );

    return {
        getPointStyleIcon,
        getPointStyle,
        getPointStyleComponent,
    };
};

export default usePerfBrowserPointStyles;
