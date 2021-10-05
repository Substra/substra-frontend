import App from '@/App';
import '@/index.css';
import { StoreProvider } from '@/store';

import { StrictMode } from 'react';

import { ChakraProvider } from '@chakra-ui/react';
import ReactDOM from 'react-dom';

import theme from '@/assets/chakraTheme/index';

ReactDOM.render(
    <StoreProvider>
        <StrictMode>
            <ChakraProvider theme={theme}>
                <App />
            </ChakraProvider>
        </StrictMode>
    </StoreProvider>,
    document.getElementById('root')
);
