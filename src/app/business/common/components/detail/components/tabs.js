import React from 'react';
import {css} from 'emotion';
import {
    Tab as TabSUI,
    cssTabTemplate,
} from '@substrafoundation/substra-ui';
import {primaryAccent} from '../../../../../../../assets/css/variables/colors';

const colorOverride = css`
    ${cssTabTemplate};
    &.selected {
        color: ${primaryAccent};
    }
`;

const Tab = (props) => (
    <TabSUI
        className={colorOverride}
        {...props}
    />
);
Tab.tabsRole = 'Tab';

export default Tab;
