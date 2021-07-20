import App from '@/App';
import '@/index.css';
import { StoreProvider } from '@/store';

import { StrictMode } from 'react';

import ReactDOM from 'react-dom';

ReactDOM.render(
    <StoreProvider>
        <StrictMode>
            <App />
        </StrictMode>
    </StoreProvider>,
    document.getElementById('root')
);
