import { useContext } from 'react';

import { IconType } from 'react-icons/lib';
import {
    RiCheckboxBlankFill,
    RiCheckboxBlankLine,
    RiCloudy2Fill,
    RiCloudy2Line,
    RiHeartFill,
    RiHeartLine,
    RiPlayFill,
    RiPlayLine,
    RiSignalWifiFill,
    RiSignalWifiLine,
    RiVipDiamondFill,
    RiVipDiamondLine,
} from 'react-icons/ri';

import chakraTheme from '@/assets/chakraTheme';
import { PerfBrowserContext } from '@/hooks/usePerfBrowser';
import { PERF_BROWSER_COLORSCHEMES } from '@/hooks/usePerfBrowserColors';
import {
    isAverageNode,
    STATIC_AVERAGE_NODE_IDS,
} from '@/modules/nodes/NodesUtils';
import { SerieT } from '@/modules/series/SeriesTypes';

const POINT_STYLE_ICONS = [
    'play',
    'checkbox-blank',
    // 'checkbox-blank-circle',
    'heart',
    'signal-wifi',
    'vip-diamond',
    'cloudy-2',
] as const;

type PointStyleIcon = typeof POINT_STYLE_ICONS[number];

type PointStyleVariant = 'line' | 'fill';

const POINT_STYLE_ICON_COMPONENTS: Record<
    PointStyleIcon,
    Record<PointStyleVariant, IconType>
> = {
    play: {
        line: RiPlayLine,
        fill: RiPlayFill,
    },
    'checkbox-blank': {
        line: RiCheckboxBlankLine,
        fill: RiCheckboxBlankFill,
    },
    // 'checkbox-blank-circle': {
    //     line: RiCheckboxBlankCircleLine,
    //     fill: RiCheckboxBlankCircleFill,
    // },
    heart: {
        line: RiHeartLine,
        fill: RiHeartFill,
    },
    'signal-wifi': {
        line: RiSignalWifiLine,
        fill: RiSignalWifiFill,
    },
    'vip-diamond': {
        line: RiVipDiamondLine,
        fill: RiVipDiamondFill,
    },
    'cloudy-2': {
        line: RiCloudy2Line,
        fill: RiCloudy2Fill,
    },
};

const DATA_URL_BUILDER: Record<
    PointStyleIcon,
    Record<PointStyleVariant, (color: string) => string>
> = {
    play: {
        line: (color: string) =>
            `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M16.394 12L10 7.737v8.526L16.394 12zm2.982.416L8.777 19.482A.5.5 0 0 1 8 19.066V4.934a.5.5 0 0 1 .777-.416l10.599 7.066a.5.5 0 0 1 0 .832z' fill='${color}'/%3E%3C/svg%3E`,
        fill: (color: string) =>
            `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M19.376 12.416L8.777 19.482A.5.5 0 0 1 8 19.066V4.934a.5.5 0 0 1 .777-.416l10.599 7.066a.5.5 0 0 1 0 .832z' fill='${color}'/%3E%3C/svg%3E`,
    },
    'checkbox-blank': {
        line: (color: string) =>
            `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v14h14V5H5z' fill='${color}'/%3E%3C/svg%3E`,
        fill: (color: string): string =>
            `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z' fill='${color}'/%3E%3C/svg%3E`,
    },
    // 'checkbox-blank-circle': {
    //     line: (color: string) =>
    //         `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z' fill='${color}'/%3E%3C/svg%3E`,
    //     fill: (color: string) =>
    //         `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='undefined' fill='${color}'/%3E%3C/svg%3E`, // TODO: there's something wrong with this one
    // },
    heart: {
        line: (color: string) =>
            `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0H24V24H0z'/%3E%3Cpath d='M12.001 4.529c2.349-2.109 5.979-2.039 8.242.228 2.262 2.268 2.34 5.88.236 8.236l-8.48 8.492-8.478-8.492c-2.104-2.356-2.025-5.974.236-8.236 2.265-2.264 5.888-2.34 8.244-.228zm6.826 1.641c-1.5-1.502-3.92-1.563-5.49-.153l-1.335 1.198-1.336-1.197c-1.575-1.412-3.99-1.35-5.494.154-1.49 1.49-1.565 3.875-.192 5.451L12 18.654l7.02-7.03c1.374-1.577 1.299-3.959-.193-5.454z' fill='${color}'/%3E%3C/svg%3E`,
        fill: (color: string) =>
            `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0H24V24H0z'/%3E%3Cpath d='M12.001 4.529c2.349-2.109 5.979-2.039 8.242.228 2.262 2.268 2.34 5.88.236 8.236l-8.48 8.492-8.478-8.492c-2.104-2.356-2.025-5.974.236-8.236 2.265-2.264 5.888-2.34 8.244-.228z' fill='${color}'/%3E%3C/svg%3E`,
    },
    'signal-wifi': {
        line: (color: string) =>
            `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0H24V24H0z'/%3E%3Cpath d='M12 3c4.284 0 8.22 1.497 11.31 3.996L12 21 .69 6.997C3.78 4.497 7.714 3 12 3zm0 2c-3.028 0-5.923.842-8.42 2.392L12 17.817 20.42 7.39C17.922 5.841 15.027 5 12 5z' fill='${color}'/%3E%3C/svg%3E`,
        fill: (color: string) =>
            `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0H24V24H0z'/%3E%3Cpath d='M12 3c4.284 0 8.22 1.497 11.31 3.996L12 21 .69 6.997C3.78 4.497 7.714 3 12 3z' fill='${color}'/%3E%3C/svg%3E`,
    },
    'vip-diamond': {
        line: (color: string) =>
            `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M4.873 3h14.254a1 1 0 0 1 .809.412l3.823 5.256a.5.5 0 0 1-.037.633L12.367 21.602a.5.5 0 0 1-.706.028c-.007-.006-3.8-4.115-11.383-12.329a.5.5 0 0 1-.037-.633l3.823-5.256A1 1 0 0 1 4.873 3zm.51 2l-2.8 3.85L12 19.05 21.417 8.85 18.617 5H5.383z' fill='${color}'/%3E%3C/svg%3E`,
        fill: (color: string) =>
            `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M4.873 3h14.254a1 1 0 0 1 .809.412l3.823 5.256a.5.5 0 0 1-.037.633L12.367 21.602a.5.5 0 0 1-.734 0L.278 9.302a.5.5 0 0 1-.037-.634l3.823-5.256A1 1 0 0 1 4.873 3z' fill='${color}'/%3E%3C/svg%3E`,
    },
    'cloudy-2': {
        line: (color: string) =>
            `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M17 21H7A6 6 0 0 1 5.008 9.339a7 7 0 1 1 13.984 0A6 6 0 0 1 17 21zM7 19h10a4 4 0 1 0-.426-7.978 5 5 0 1 0-9.148 0A4 4 0 1 0 7 19z' fill='${color}'/%3E%3C/svg%3E`,
        fill: (color: string) =>
            `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M17 21H7A6 6 0 0 1 5.008 9.339a7 7 0 1 1 13.984 0A6 6 0 0 1 17 21z' fill='${color}'/%3E%3C/svg%3E`,
    },
};

// gray has to be included for averages
const ALL_COLORS: string[] = [...PERF_BROWSER_COLORSCHEMES, 'gray'].reduce(
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

const getImg = (
    icon: PointStyleIcon,
    variant: PointStyleVariant,
    color: string
) => {
    const img = new Image(10, 10);
    img.src = DATA_URL_BUILDER[icon][variant](color.replace('#', '%23'));
    return img;
};

const getAllImgs = (
    icon: PointStyleIcon,
    variant: PointStyleVariant
): Record<string, HTMLImageElement> => {
    const res: Record<string, HTMLImageElement> = {};
    for (const color of ALL_COLORS) {
        res[color] = getImg(icon, variant, color);
    }
    return res;
};

export const POINT_STYLES: Record<
    PointStyleIcon,
    Record<PointStyleVariant, Record<string, HTMLImageElement>>
> = {
    play: {
        fill: getAllImgs('play', 'fill'),
        line: getAllImgs('play', 'line'),
    },
    'checkbox-blank': {
        fill: getAllImgs('checkbox-blank', 'fill'),
        line: getAllImgs('checkbox-blank', 'line'),
    },
    // 'checkbox-blank-circle': {
    //     fill: getAllImgs('checkbox-blank-circle', 'fill'),
    //     line: getAllImgs('checkbox-blank-circle', 'line'),
    // },
    heart: {
        fill: getAllImgs('heart', 'fill'),
        line: getAllImgs('heart', 'line'),
    },
    'signal-wifi': {
        fill: getAllImgs('signal-wifi', 'fill'),
        line: getAllImgs('signal-wifi', 'line'),
    },
    'vip-diamond': {
        fill: getAllImgs('vip-diamond', 'fill'),
        line: getAllImgs('vip-diamond', 'line'),
    },
    'cloudy-2': {
        fill: getAllImgs('cloudy-2', 'fill'),
        line: getAllImgs('cloudy-2', 'line'),
    },
};

const usePerfBrowserPointStyles = () => {
    const { nodes } = useContext(PerfBrowserContext);

    const getPointStyleIcon = (worker: string): PointStyleIcon | null => {
        const index = [
            ...STATIC_AVERAGE_NODE_IDS,
            ...nodes.map((n) => n.id),
        ].indexOf(worker);

        if (index === -1) {
            return null;
        }

        return POINT_STYLE_ICONS[index % POINT_STYLE_ICONS.length];
    };

    const getPointStyleVariant = (worker: string): PointStyleVariant => {
        if (isAverageNode(worker)) {
            return 'line';
        }
        return 'fill';
    };

    const getPointStyleComponent = (worker: string): IconType | null => {
        const icon = getPointStyleIcon(worker);
        if (icon === null) {
            return null;
        }
        const variant = getPointStyleVariant(worker);
        return POINT_STYLE_ICON_COMPONENTS[icon][variant];
    };

    const getPointStyle = (
        serie: SerieT,
        color: string
    ): HTMLImageElement | 'circle' => {
        const icon = getPointStyleIcon(serie.worker);
        if (icon === null) {
            return 'circle';
        }
        const variant = getPointStyleVariant(serie.worker);
        return POINT_STYLES[icon][variant][color] || 'circle';
    };

    return {
        getPointStyleIcon,
        getPointStyleVariant,
        getPointStyle,
        getPointStyleComponent,
    };
};

export default usePerfBrowserPointStyles;
