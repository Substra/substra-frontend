import React from 'react';
import {css} from 'emotion';
import {
    cssTabTemplate,
    Tab as TabSUI,
} from '../../tabs';
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
