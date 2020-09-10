import React from 'react';
import PropTypes from 'prop-types';
import {css} from 'emotion';
import {fontLarge} from '../../../../../../assets/css/variables/font';
import {spacingSmall} from '../../../../../../assets/css/variables/spacing';

export const title = css`
    font-weight: bold;
    font-size: ${fontLarge};
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    padding-right: ${spacingSmall};
`;

const Title = ({o}) => (
    <div className={title} title={o && o.name}>
        {o && o.name}
    </div>
);

Title.propTypes = {
    o: PropTypes.shape({
        name: PropTypes.string,
    }),
};

Title.defaultProps = {
    o: null,
};

export default Title;
