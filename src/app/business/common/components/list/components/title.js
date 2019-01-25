import React from 'react';
import PropTypes from 'prop-types';
import {css} from 'emotion';
import {fontLarge} from '../../../../../../../assets/css/variables/font';

export const title = css`
    font-weight: bold;
    font-size: ${fontLarge};
`;

const Title = ({o}) => (
    <div className={title}>
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
