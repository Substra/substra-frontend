import React from 'react';
import PropTypes from 'prop-types';
import {css} from 'emotion';

const spacing = css`
    margin-right: 5px;
`;

const BrowseRelatedLinksWrapper = ({children, ...props}) => (
    <div {...props}>
        <span className={spacing}>Browse related</span>
        {children}
    </div>
);

BrowseRelatedLinksWrapper.propTypes = {
    children: PropTypes.node,
};

BrowseRelatedLinksWrapper.defaultProps = {
    children: null,
};

export default BrowseRelatedLinksWrapper;
