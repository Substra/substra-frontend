import { StrictMode } from 'react';

import ReactDOM from 'react-dom';

import { ChakraProvider } from '@chakra-ui/react';

import App from '@/App';
import Fonts from '@/assets/Fonts';
import theme from '@/assets/chakraTheme';
import { StoreProvider } from '@/store';

ReactDOM.render(
    <StoreProvider>
        <StrictMode>
            <ChakraProvider theme={theme}>
                <Fonts />
                <App />
            </ChakraProvider>
        </StrictMode>
    </StoreProvider>,
    document.getElementById('root')
);
