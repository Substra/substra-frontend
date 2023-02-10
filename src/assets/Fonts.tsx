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
                font-weight: 700;
                font-dispaly: swap;
                src: url("/fonts/Gattica-Bold100.otf") format("opentype");
            }
            @font-face {
                font-family: 'Inter';
                font-style:  normal;
                font-weight: 300;
                font-display: swap;
                src: url("/fonts/Inter-Light.ttf") format("truetype");
            }
            @font-face {
                font-family: 'Inter';
                font-style:  normal;
                font-weight: 400;
                font-display: swap;
                src: url("/fonts/Inter-Regular.ttf") format("truetype");
            }
            @font-face {
                font-family: 'Inter';
                font-style:  normal;
                font-weight: 500;
                font-display: swap;
                src: url("/fonts/Inter-Medium.ttf") format("truetype");
            }
                 `}
    />
);

export default Fonts;
