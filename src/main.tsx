import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import { ChakraProvider } from '@chakra-ui/react';

import App from '@/App';
import Fonts from '@/assets/Fonts';
import theme from '@/assets/chakraTheme';
import { StoreProvider } from '@/store';

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error('Failed to find the root element');
}
const root = createRoot(rootElement);

root.render(
    <StoreProvider>
        <StrictMode>
            <ChakraProvider theme={theme}>
                <Fonts />
                <App />
            </ChakraProvider>
        </StrictMode>
    </StoreProvider>
);
