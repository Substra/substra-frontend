import { extendTheme } from '@chakra-ui/react';

export default extendTheme({
    components: {
        Heading: {
            sizes: {
                xxs: {
                    fontSize: 'xs',
                    lineHeight: '1.2',
                },
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
