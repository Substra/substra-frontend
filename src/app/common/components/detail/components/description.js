import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

const Description = ({item}) => {
    if (item && item.description) {
        return <ReactMarkdown source={item.description.content} />;
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
