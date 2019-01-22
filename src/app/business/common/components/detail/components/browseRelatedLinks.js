import React, {Component} from 'react';
import Link from 'redux-first-router-link';
import PropTypes from 'prop-types';
import {css} from 'emotion';
import {omit} from 'lodash';
import {connect} from 'react-redux';

const spacing = css`
    margin-right: 5px;
`;

export const BrowseRelatedLinksWrapper = ({children, ...rest}) => (
    <div {...rest}>
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

const routeTypes = {
    algo: 'ALGORITHM',
    dataset: 'DATASET',
    model: 'MODEL',
    challenge: 'CHALLENGE',
};

class BrowseRelatedLink extends Component {
    getUrl = () => {
        const {model, filter, order} = this.props;

        return {
            type: routeTypes[model],
            meta: {
                query: {
                    search: filter,
                    ...(order.prune ? omit(order, ['prune']) : {}), // add own order if necessary
                },
            },
        };
    };

    render() {
        const {label} = this.props;

        return (
            <Link to={this.getUrl()} className={spacing}>
                {label}
            </Link>
);
    }
}

BrowseRelatedLink.propTypes = {
    label: PropTypes.string,
    model: PropTypes.string,
    filter: PropTypes.string,
    order: PropTypes.shape(),
};

BrowseRelatedLink.defaultProps = {
    label: '',
    model: '',
    filter: '',
    order: null,
};


const mapStateToProps = (state, ownProps) => {
    console.log(ownProps);

    return {
        order: ownProps && ownProps.model ? state[ownProps.model].order : null,
    };
};

export default connect(mapStateToProps)(BrowseRelatedLink);
