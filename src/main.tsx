import React from 'react';
import ReactDOM from 'react-dom';

import '@/index.css';
import App from '@/App';
import { StoreProvider } from '@/store';

ReactDOM.render(
    <StoreProvider>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </StoreProvider>,
    document.getElementById('root')
);
