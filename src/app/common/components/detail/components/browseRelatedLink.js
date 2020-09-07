import React, {Component} from 'react';
import Link from 'redux-first-router-link';
import PropTypes from 'prop-types';
import {css} from 'emotion';
import {omit, noop} from 'lodash';
import {connect} from 'react-redux';

const spacing = css`
    margin-right: 5px;
`;

const routeTypes = {
    algo: 'ALGORITHM',
    dataset: 'DATASET',
    model: 'MODEL',
    objective: 'OBJECTIVE',
};

class BrowseRelatedLink extends Component {
    getUrl = () => {
        const {model, filter, order} = this.props;

        return {
            type: routeTypes[model],
            meta: {
                query: {
                    search: encodeURIComponent(filter),
                    ...(order && !order.pristine ? omit(order, ['pristine']) : {}), // add own order if necessary
                },
            },
        };
    };

    render() {
        const {label, unselect} = this.props;

        return (
            <Link to={this.getUrl()} className={spacing} onClick={unselect}>
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
    unselect: PropTypes.func,
};

BrowseRelatedLink.defaultProps = {
    label: '',
    model: '',
    filter: '',
    order: null,
    unselect: noop,
};


const mapStateToProps = (state, ownProps) => ({
        order: ownProps && ownProps.model && state[ownProps.model] ? state[ownProps.model].order : null,
    }
);

export default connect(mapStateToProps)(BrowseRelatedLink);
