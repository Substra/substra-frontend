import { Global } from '@emotion/react';

const Fonts = () => (
    <Global
        styles={`
            /* latin */
            @font-face {
                font-family: 'Gattica';
                font-style: normal;
                font-weight: 100;
                font-dispaly: swap;
                src: url("/fonts/Gattica-Light100.otf") format("opentype");
            }
            @font-face {
                font-family: 'Gattica';
                font-style: normal;
                font-weight: 400;
                font-dispaly: swap;
                src: url("/fonts/Gattica-Regular100.otf") format("opentype");
            }
            @font-face {
                font-family: 'Gattica';
                font-style: normal;
                font-weight: 500;
                font-dispaly: swap;
                src: url("/fonts/Gattica-Medium100.otf") format("opentype");
            }
            @font-face {
                font-family: 'Gattica';
                font-style: normal;
                font-weight: 700;
                font-dispaly: swap;
                src: url("/fonts/Gattica-Bold100.otf") format("opentype");
            }
                 `}
    />
);

export default Fonts;
