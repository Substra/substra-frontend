import App from '@/App';
import { StoreProvider } from '@/store';

import { StrictMode } from 'react';

import { ChakraProvider } from '@chakra-ui/react';
import ReactDOM from 'react-dom';

import Fonts from '@/assets/Fonts';
import theme from '@/assets/chakraTheme';

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
