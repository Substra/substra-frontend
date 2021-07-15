import { StrictMode } from 'react';
import ReactDOM from 'react-dom';

import '@/index.css';
import App from '@/App';
import { StoreProvider } from '@/store';

ReactDOM.render(
    <StoreProvider>
        <StrictMode>
            <App />
        </StrictMode>
    </StoreProvider>,
    document.getElementById('root')
);
