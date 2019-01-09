import React from 'react';
import PropTypes from 'prop-types';

const Folder = ({
                    className, width, height, color, ...props
                }) => (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={width}
                        height={height}
                        viewBox="0 0 24 24"
                        className={className}
                        {...props}
                    >
                        <g
                            fill={color}
                            fillRule="nonzero"
                        >
                            <path d="M8.465 4H4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-9a1 1 0 0 1-.832-.445L8.465 4zm3.07 1H20a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3h5a1 1 0 0 1 .832.445L11.535 5z" />
                            <path d="M8.465 4H4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-9a1 1 0 0 1-.832-.445L8.465 4zm3.07 1H20a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3h5a1 1 0 0 1 .832.445L11.535 5z" />
                        </g>
                    </svg>
    );

Folder.defaultProps = {
    className: '',
    width: 24,
    height: 24,
    color: '#4B6073',
};

Folder.propTypes = {
    className: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    color: PropTypes.string,
};

export default Folder;
