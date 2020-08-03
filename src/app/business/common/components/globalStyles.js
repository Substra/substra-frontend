import React from 'react';

import {Global, css} from '@emotion/core';
import emotionNormalize from 'emotion-normalize';
import {iceBlue, slate} from '../../../../../assets/css/variables/colors';
import {fontNormal} from '../../../../../assets/css/variables/font';
import {spacingSmall} from '../../../../../assets/css/variables/spacing';

// unused for now
// const fontFaceItalic = (variant, weight) => css`
//     ${fontFace(variant, 'normal', weight)}
//     ${fontFace(`${variant}Italic`, 'italic', weight)}
// `;


// hardcode which font we want for avoiding making webpack load all available fonts
const fontFaceNormal = `
        @font-face {
            font-family: 'Lato';
            font-style: normal;
            font-weight: 700;
            src: url(${require('./lato/LatoLatin-Bold.eot')}); /* IE9 Compat Modes */
            src: url('${require('./lato/LatoLatin-Bold.eot')}?#iefix') format('embedded-opentype'), /* IE6-IE8 */
                 url(${require('./lato/LatoLatin-Bold.woff2')}) format('woff2'), /* Super Modern Browsers */
                 url(${require('./lato/LatoLatin-Bold.woff')}) format('woff'), /* Pretty Modern Browsers */
                 url(${require('./lato/LatoLatin-Bold.ttf')}) format('truetype'); /* Safari, Android, iOS */
        };
        @font-face {
            font-family: 'Lato';
            font-style: normal;
            font-weight: 400;
            src: url(${require('./lato/LatoLatin-Regular.eot')}); /* IE9 Compat Modes */
            src: url('${require('./lato/LatoLatin-Regular.eot')}?#iefix') format('embedded-opentype'), /* IE6-IE8 */
                 url(${require('./lato/LatoLatin-Regular.woff2')}) format('woff2'), /* Super Modern Browsers */
                 url(${require('./lato/LatoLatin-Regular.woff')}) format('woff'), /* Pretty Modern Browsers */
                 url(${require('./lato/LatoLatin-Regular.ttf')}) format('truetype'); /* Safari, Android, iOS */
        };
    `;


const globalStyles = css`
    ${emotionNormalize}
    
    ${fontFaceNormal};
    
    html {
        box-sizing: border-box;
    }

    *, *:before, *:after {
        box-sizing: inherit;
    }

    html, body, #root, #root > div {
        height: 100%;
    }

    body {
        margin: 0;
        padding: 0;
        background: ${iceBlue};
        color: ${slate};
        font-family: 'Lato', sans-serif;
        font-size: ${fontNormal};
        letter-spacing: 0.5px;

        -webkit-font-smoothing: antialiased; /* This needs to be set or some font faced fonts look bold on Mac in Chrome/Webkit based browsers. */
        -moz-osx-font-smoothing: grayscale; /* Fixes font bold issue in Firefox version 25+ on Mac */
    }

    h1, h2, h3, h4 {
        margin: 0;
    }

    button,
    html [type="button"], /* 1 */
    [type="reset"],
    [type="submit"] {
        -webkit-appearance: none; /* 2 */
    }
    
    .error { color: #ba0000; }

    span.error {
        display: block;
        margin-top: ${spacingSmall};
        font-size: ${fontNormal};
    }

    dl { display: inline-block;vertical-align: top; }
    dd, dt { display: inline-block; }
    dt { width: 45%;padding-right: 5%; }
    dd { width: 50%; }
`;

const GlobalStyles = () => <Global styles={globalStyles} />;

export default GlobalStyles;
