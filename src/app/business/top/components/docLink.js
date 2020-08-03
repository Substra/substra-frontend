import React from 'react';
import PropTypes from 'prop-types';
import {css} from 'emotion';

import {slate} from '../../../../../assets/css/variables/colors';
import Book from '../../common/components/icons/book';

const picto = css`
    display: block;
`;

export const DocLink = ({className}) => (
    <a
        href="https://github.com/substrafoundation/substra"
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        data-testid="link"
    >
        <Book className={picto} color={slate} />
        Docs
    </a>
);

DocLink.propTypes = {
    className: PropTypes.string,
};

DocLink.defaultProps = {
    className: null,
};

export default DocLink;
