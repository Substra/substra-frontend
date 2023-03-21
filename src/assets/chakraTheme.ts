import { extendTheme } from '@chakra-ui/react';

const noBorderRadius = {
    borderRadius: 'none',
};

const noDefaultBorderRadius = {
    baseStyle: noBorderRadius,
};

type ColorSchemeT = {
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

const colors: Record<string, ColorSchemeT> = {
    primary: {
        '50': '#f2f4ff',
        '100': '#dde3ff',
        '200': '#c0caff',
        '300': '#96a4fe',
        '400': '#656eef',
        '500': '#5752ff',
        '600': '#4525ee',
        '700': '#2a119d',
        '800': '#18115f',
        '900': '#0c0e2f',
    },
    gray: {
        '50': '#fafafa',
        '100': '#ededf0',
        '200': '#e3e4ea',
        '300': '#d2d3df',
        '400': '#abadbc',
        '500': '#7b7d90',
        '600': '#515369',
        '700': '#393b51',
        '800': '#1e1f37',
        '900': '#181a34',
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
    yellow: {
        '50': '#fffae9',
        '100': '#ffedb3',
        '200': '#ffd86a',
        '300': '#ffcf35',
        '400': '#edbe11',
        '500': '#cea400',
        '600': '#a48200',
        '700': '#816500',
        '800': '#533f00',
        '900': '#453500',
    },
    green: {
        '50': '#f5fcf6',
        '100': '#d0f8d8',
        '200': '#abe1b5',
        '300': '#68ca7b',
        '400': '#2aac43',
        '500': '#329642',
        '600': '#1c722c',
        '700': '#196728',
        '800': '#134c1e',
        '900': '#0f4019',
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
    blue: {
        '50': '#f9fafd',
        '100': '#eaedf9',
        '200': '#cbd4f1',
        '300': '#a6b4e8',
        '400': '#7e93dd',
        '500': '#5671d2',
        '600': '#3b5acb',
        '700': '#2c4ec7',
        '800': '#1233ac',
        '900': '#0f2a90',
    },
    purple: {
        '50': '#fff8fc',
        '100': '#fee7f5',
        '200': '#fdc4e7',
        '300': '#f790cf',
        '400': '#f350b6',
        '500': '#e20a90',
        '600': '#be0879',
        '700': '#ac086e',
        '800': '#820652',
        '900': '#6d0545',
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
};

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
        Button: {
            baseStyle: {
                ...noBorderRadius,
                fontFamily: 'Gattica',
            },
        },
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
        Kbd: noDefaultBorderRadius,
        Link: {
            baseStyle: {
                color: `primary.500`,
            },
        },
        Menu: {
            baseStyle: {
                list: {
                    ...noBorderRadius,
                    fontSize: 'sm',
                },
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
        Skeleton: {
            ...noDefaultBorderRadius,
            defaultProps: {
                startColor: 'gray.50',
                endColor: 'gray.200',
            },
        },
        Table: {
            sizes: {
                md: {
                    td: {
                        px: '3',
                        _first: {
                            paddingLeft: '6',
                        },
                        _last: {
                            paddingRight: '6',
                        },
                    },
                    th: {
                        px: '3',
                        _first: {
                            paddingLeft: '6',
                        },
                        _last: {
                            paddingRight: '6',
                        },
                    },
                },
            },
        },
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
        Text: {
            defaultStyle: {
                fontSize: 'sm',
            },
        },
    },
    fonts: {
        heading: 'Gattica',
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
