import React from 'react';
import PropTypes from 'prop-types';

const Github = ({
color, width, height, className,
}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} className={className} viewBox="0 0 34 35">
        <path
            fill={color}
            fillRule="nonzero"
            d="M0 18.335c0 7.622 4.758 14.102 11.389 16.482.893.231.756-.423.756-.866v-3.023c-5.156.62-5.362-2.884-5.71-3.467-.7-1.227-2.35-1.54-1.86-2.124 1.176-.62 2.372.157 3.756 2.26 1.003 1.525 2.958 1.269 3.951 1.013a4.968 4.968 0 0 1 1.319-2.373c-5.34-.982-7.568-4.329-7.568-8.31 0-1.93.621-3.706 1.836-5.138-.773-2.362.074-4.38.186-4.68 2.209-.205 4.5 1.622 4.679 1.765 1.254-.347 2.686-.532 4.286-.532 1.61 0 3.048.191 4.31.542.428-.334 2.556-1.902 4.609-1.711.11.3.936 2.274.21 4.602 1.231 1.435 1.858 3.225 1.858 5.161 0 3.988-2.24 7.34-7.597 8.307a5.044 5.044 0 0 1 1.448 3.552v4.391c.03.351 0 .7.571.7C29.156 32.556 34 26.028 34 18.337 34 8.694 26.387.885 17 .885 7.608.882 0 8.692 0 18.335z"
        />
    </svg>
);

Github.defaultProps = {
    className: '',
    color: '#000',
    width: 36,
    height: 36,
};

Github.propTypes = {
    className: PropTypes.string,
    color: PropTypes.string,
    width: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    height: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
};

export default Github;
