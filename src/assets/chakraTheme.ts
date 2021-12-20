import { extendTheme } from '@chakra-ui/react';

const noBorderRadius = {
    borderRadius: 'none',
};

const noDefaultBorderRadius = {
    baseStyle: noBorderRadius,
};

type ColorScheme = {
    '50': string;
    '100': string;
    '200': string;
    '300': string;
    '400': string;
    '500': string;
    '600': string;
    '700': string;
    '800': string;
    '900': string;
};

const colors: Record<string, ColorScheme> = {
    gray: {
        '50': '#fafafa',
        '100': '#f1f1f1',
        '200': '#e7e7e7',
        '300': '#d9d9d9',
        '400': '#adadad',
        '500': '#7f7f7f',
        '600': '#545454',
        '700': '#373737',
        '800': '#202020',
        '900': '#191919',
    },
    red: {
        '50': '#fff5f6',
        '100': '#fed7da',
        '200': '#feb1b9',
        '300': '#fd7e92',
        '400': '#f8607d',
        '500': '#f31b61',
        '600': '#cb1c51',
        '700': '#9f2342',
        '800': '#852139',
        '900': '#651227',
    },
    orange: {
        '50': '#fffaf0',
        '100': '#feebcb',
        '200': '#fbd38d',
        '300': '#f6ad55',
        '400': '#ed8936',
        '500': '#dd6b20',
        '600': '#c05621',
        '700': '#9c4221',
        '800': '#7b341e',
        '900': '#652b19',
    },
    pink: {
        '50': '#fff5f7',
        '100': '#fed7e1',
        '200': '#f0b7c7',
        '300': '#e692ab',
        '400': '#e17096',
        '500': '#cf5380',
        '600': '#b63a6b',
        '700': '#952f57',
        '800': '#722743',
        '900': '#512031',
    },
    green: {
        '50': '#f3fef2',
        '100': '#cff4cd',
        '200': '#aae4a8',
        '300': '#80d182',
        '400': '#5cb962',
        '500': '#559f59',
        '600': '#468349',
        '700': '#3b653c',
        '800': '#325233',
        '900': '#294429',
    },
    teal: {
        '50': '#e5fffe',
        '100': '#adf5f4',
        '200': '#79e6e5',
        '300': '#3bcccc',
        '400': '#31b2b2',
        '500': '#2f9797',
        '600': '#2d7a7a',
        '700': '#295e5e',
        '800': '#244e4e',
        '900': '#1e4040',
    },
    blue: {
        '50': '#e7f7ff',
        '100': '#c2dfff',
        '200': '#98c9ff',
        '300': '#5fb0ff',
        '400': '#399cfc',
        '500': '#0084dc',
        '600': '#006ebd',
        '700': '#005595',
        '800': '#004e85',
        '900': '#07385d',
    },
    cyan: {
        '50': '#edfdfd',
        '100': '#c4f1f9',
        '200': '#9decf9',
        '300': '#76e4f7',
        '400': '#0bc5ea',
        '500': '#00b5d8',
        '600': '#00a3c4',
        '700': '#0987a0',
        '800': '#086f83',
        '900': '#065666',
    },
    purple: {
        '50': '#f9f5ff',
        '100': '#e6d9fe',
        '200': '#d3bdfc',
        '300': '#b395f6',
        '400': '#9b7bec',
        '500': '#7b5cd7',
        '600': '#6448c3',
        '700': '#533d9b',
        '800': '#45337a',
        '900': '#302842',
    },
    yellow: {
        '50': '#FFFFF0',
        '100': '#FEFCBF',
        '200': '#FAF089',
        '300': '#F6E05E',
        '400': '#ECC94B',
        '500': '#D69E2E',
        '600': '#B7791F',
        '700': '#975A16',
        '800': '#744210',
        '900': '#5F370E',
    },
};

/** Generate light color schemes
 *
 * A light color scheme is a colorscheme where all values were shifted by one level.
 * For example the 400 becomes 500, therefore the 500 is visually lighter.
 *
 * This is needed for checkboxes in the PerfSidebarSectionComputePlans components,
 * where we have a hiearchy of checkboxes and want lighter colors for lower levels
 * of the hiearchy.
 *
 * The only way I found for styling the control was through the theme, but if
 * you find how to make it work through __css props and StylesProvider / useMultiStyleConfig
 * feel free to delete all of this
 */

export const HAS_LIGHT_COLORSCHEME = [
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

export const lightenColorName = (colorName: string): string =>
    `light${colorName[0].toUpperCase()}${colorName.slice(1)}`;

for (const colorName of HAS_LIGHT_COLORSCHEME) {
    const lightColorName = lightenColorName(colorName);
    const colorScheme = colors[colorName];
    const lightColorScheme = { ...colorScheme };
    const indexes = [
        '50',
        '100',
        '200',
        '300',
        '400',
        '500',
        '600',
        '700',
        '800',
        '900',
    ];
    for (let i = indexes.length - 1; i > 0; i--) {
        const intensity = indexes[i];
        const lowerIntensity = indexes[i - 1];
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore: I couldn't figure how to explain to TS that this was legit
        lightColorScheme[intensity] = colorScheme[lowerIntensity];
    }
    colors[lightColorName] = lightColorScheme;
}

export default extendTheme({
    colors,
    components: {
        Alert: {
            baseStyle: ({ colorScheme }: { colorScheme: string }) => {
                return {
                    container: {
                        ...noBorderRadius,
                        alignItems: 'flex-start',
                        fontSize: 'xs',
                        padding: 4,
                        color: `${colorScheme}.900`,
                    },
                    icon: {
                        marginEnd: 3.5,
                    },
                };
            },
        },
        Badge: {
            variants: {
                solid: noBorderRadius,
                subtle: noBorderRadius,
            },
        },
        Button: noDefaultBorderRadius,
        CloseButton: noDefaultBorderRadius,
        Heading: {
            sizes: {
                xxs: {
                    fontSize: 'xs',
                    lineHeight: '1.2',
                },
            },
        },
        Input: {
            variants: {
                outline: {
                    field: noBorderRadius,
                },
            },
        },
        Menu: {
            baseStyle: {
                list: noBorderRadius,
            },
        },
        Modal: {
            baseStyle: {
                dialog: noBorderRadius,
            },
        },
        Popover: {
            baseStyle: {
                content: noBorderRadius,
                closeButton: noBorderRadius,
            },
        },
        Skeleton: noDefaultBorderRadius,
        Tabs: {
            variants: {
                'soft-rounded': { tab: noBorderRadius },
                enclosed: { tab: noBorderRadius },
            },
        },
        Tag: {
            sizes: {
                sm: { container: noBorderRadius },
                md: { container: noBorderRadius },
                lg: { container: noBorderRadius },
            },
        },
    },
    fonts: {
        heading: 'Inter',
        body: 'Inter',
    },
    styles: {
        global: {
            body: {
                bg: 'gray.50',
            },
        },
    },
});
