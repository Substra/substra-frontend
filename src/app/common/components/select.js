import React from 'react';
import {css} from 'emotion';

import {ice, white} from '../../../../assets/css/variables/colors';
import {
    spacingExtraSmall,
    spacingLarge,
    spacingNormal,
    spacingSmall,
} from '../../../../assets/css/variables/spacing';


// Adapted from https://www.filamentgroup.com/lab/select-css.html
// (via https://css-tricks.com/styling-a-select-like-its-2019/)
// Caret SVG:
// <svg xmlns="http://www.w3.org/2000/svg" fill="#81909d" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation"><path d="M7 10l5 5 5-5z"></path></svg>

const select = css`
    display: inline-block;
    font-size: inherit;
    font-family: inherit;
    font-weight: inherit;
    color: inherit;
    line-height: ${spacingNormal};
    padding: ${spacingExtraSmall} ${spacingLarge} ${spacingExtraSmall} ${spacingSmall};
    width: auto;
    max-width: 100%;
    box-sizing: border-box;
    margin: 0;
    border: 1px solid ${ice};
    border-radius: ${spacingNormal};
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    background-color: ${white};
    background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9IiM4MTkwOWQiIGZvY3VzYWJsZT0iZmFsc2UiIHZpZXdCb3g9IjAgMCAyNCAyNCIgYXJpYS1oaWRkZW49InRydWUiIHJvbGU9InByZXNlbnRhdGlvbiI+PHBhdGggZD0iTTcgMTBsNSA1IDUtNXoiPjwvcGF0aD48L3N2Zz4=');
    background-repeat: no-repeat;
    background-position: right 3px top 50%;
    background-size: 24px 24px;
    cursor: pointer;

    &::-ms-expand {
        display: none;
    }

    &:hover {
        border-color: ${ice};
        background-color: ${ice};
    }

    &:focus {
        border-color: ${ice};
        outline: none;
    }

    & option {
        font-weight:normal;
    }
`;

const Select = (props) => (
    <select
        className={select}
        {...props}
    />
);

export default Select;
