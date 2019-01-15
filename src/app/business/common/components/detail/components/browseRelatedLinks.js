import React from 'react';
import Link from 'redux-first-router-link';
import PropTypes from 'prop-types';

export const BrowseRelatedLinksWrapper = ({children}) => (
    <div>
        Browse related:
        {' '}
        {children}
    </div>
);

BrowseRelatedLinksWrapper.propTypes = {
    children: PropTypes.node,
};

BrowseRelatedLinksWrapper.defaultProps = {
    children: null,
};

const routeTypes = {
    algo: 'ALGORITHM',
    dataset: 'DATASET',
    model: 'MODEL',
    challenge: 'CHALLENGE',
};

export class BrowseRelatedLink extends React.Component {
    searchString() {
        const {model, filter} = this.props;
        return `${model}:${filter}`;
    }

    render() {
        const {label, model} = this.props;
        return (
            <Link to={{type: routeTypes[model], meta: {query: {search: this.searchString()}}}}>
                {label}
            </Link>
        );
    }
}

BrowseRelatedLink.propTypes = {
    label: PropTypes.string,
    model: PropTypes.string,
    filter: PropTypes.string,
};

BrowseRelatedLink.defaultProps = {
    label: '',
    model: '',
    filter: '',
};
