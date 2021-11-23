import { Global } from '@emotion/react';

const Fonts = () => (
    <Global
        styles={`
            /* latin */
            @font-face {
                font-family: 'Inter';
                font-style:  normal;
                font-weight: 100;
                font-display: swap;
                src: url("/fonts/Inter-Thin.woff2?v=3.19") format("woff2");
            }
            @font-face {
                font-family: 'Inter';
                font-style:  italic;
                font-weight: 100;
                font-display: swap;
                src: url("/fonts/Inter-ThinItalic.woff2?v=3.19") format("woff2");
            }

            @font-face {
                font-family: 'Inter';
                font-style:  normal;
                font-weight: 200;
                font-display: swap;
                src: url("/fonts/Inter-ExtraLight.woff2?v=3.19") format("woff2");
            }
            @font-face {
                font-family: 'Inter';
                font-style:  italic;
                font-weight: 200;
                font-display: swap;
                src: url("/fonts/Inter-ExtraLightItalic.woff2?v=3.19") format("woff2");
            }

            @font-face {
                font-family: 'Inter';
                font-style:  normal;
                font-weight: 300;
                font-display: swap;
                src: url("/fonts/Inter-Light.woff2?v=3.19") format("woff2");
            }
            @font-face {
                font-family: 'Inter';
                font-style:  italic;
                font-weight: 300;
                font-display: swap;
                src: url("/fonts/Inter-LightItalic.woff2?v=3.19") format("woff2");
            }

            @font-face {
                font-family: 'Inter';
                font-style:  normal;
                font-weight: 400;
                font-display: swap;
                src: url("/fonts/Inter-Regular.woff2?v=3.19") format("woff2");
            }
            @font-face {
                font-family: 'Inter';
                font-style:  italic;
                font-weight: 400;
                font-display: swap;
                src: url("/fonts/Inter-Italic.woff2?v=3.19") format("woff2");
            }

            @font-face {
                font-family: 'Inter';
                font-style:  normal;
                font-weight: 500;
                font-display: swap;
                src: url("/fonts/Inter-Medium.woff2?v=3.19") format("woff2");
            }
            @font-face {
                font-family: 'Inter';
                font-style:  italic;
                font-weight: 500;
                font-display: swap;
                src: url("/fonts/Inter-MediumItalic.woff2?v=3.19") format("woff2");
            }

            @font-face {
                font-family: 'Inter';
                font-style:  normal;
                font-weight: 600;
                font-display: swap;
                src: url("/fonts/Inter-SemiBold.woff2?v=3.19") format("woff2");
            }
            @font-face {
                font-family: 'Inter';
                font-style:  italic;
                font-weight: 600;
                font-display: swap;
                src: url("/fonts/Inter-SemiBoldItalic.woff2?v=3.19") format("woff2");
            }

            @font-face {
                font-family: 'Inter';
                font-style:  normal;
                font-weight: 700;
                font-display: swap;
                src: url("/fonts/Inter-Bold.woff2?v=3.19") format("woff2");
            }
            @font-face {
                font-family: 'Inter';
                font-style:  italic;
                font-weight: 700;
                font-display: swap;
                src: url("/fonts/Inter-BoldItalic.woff2?v=3.19") format("woff2");
            }

            @font-face {
                font-family: 'Inter';
                font-style:  normal;
                font-weight: 800;
                font-display: swap;
                src: url("/fonts/Inter-ExtraBold.woff2?v=3.19") format("woff2");
            }
            @font-face {
                font-family: 'Inter';
                font-style:  italic;
                font-weight: 800;
                font-display: swap;
                src: url("/fonts/Inter-ExtraBoldItalic.woff2?v=3.19") format("woff2");
            }

            @font-face {
                font-family: 'Inter';
                font-style:  normal;
                font-weight: 900;
                font-display: swap;
                src: url("/fonts/Inter-Black.woff2?v=3.19") format("woff2");
            }
            @font-face {
                font-family: 'Inter';
                font-style:  italic;
                font-weight: 900;
                font-display: swap;
                src: url("/fonts/Inter-BlackItalic.woff2?v=3.19") format("woff2");
            }
      `}
    />
);

export default Fonts;
