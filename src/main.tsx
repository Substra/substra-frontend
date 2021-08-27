import App from '@/App';
import '@/index.css';
import { StoreProvider } from '@/store';

import { StrictMode } from 'react';

import { ChakraProvider } from '@chakra-ui/react';
import ReactDOM from 'react-dom';

ReactDOM.render(
    <StoreProvider>
        <StrictMode>
            <ChakraProvider>
                <App />
            </ChakraProvider>
        </StrictMode>
    </StoreProvider>,
    document.getElementById('root')
);
