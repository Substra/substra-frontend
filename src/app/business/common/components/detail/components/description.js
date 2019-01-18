import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

const Description = ({item}) => {
    if (item && item.desc) {
        return <ReactMarkdown source={item.desc} />;
    }
    return null;
};

Description.propTypes = {
    item: PropTypes.shape(),
};

Description.defaultProps = {
    item: null,
};

export default Description;
