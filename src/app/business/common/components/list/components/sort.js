/* eslint-disable react/no-multi-comp */
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import {withStyles} from '@material-ui/core';
import NativeSelect from '@material-ui/core/NativeSelect';
import {css} from 'emotion';
import {isEqual, omit, noop} from 'lodash';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {ice, slate} from '../../../../../../../assets/css/variables/colors';
import {spacingExtraSmall, spacingLarge, spacingSmall} from '../../../../../../../assets/css/variables/spacing';
import {fontNormal} from '../../../../../../../assets/css/variables/font';

const Wrapper = styled('div')`
    font-size: ${fontNormal};
    display: inline-block;
    padding-left: 5px;
`;

const Label = styled('label')`
    margin-right: ${spacingExtraSmall};
`;

const Select = withStyles({
    root: {
        border: `1px solid ${ice}`,
        borderRadius: '20px',
        color: slate,
        overflow: 'hidden',
        fontSize: fontNormal,
    },
    select: {
        padding: `${spacingExtraSmall} ${spacingLarge} ${spacingExtraSmall} ${spacingSmall}`,
        height: '20px',
    },
    outlined: {
        display: 'none',
    },
})(NativeSelect);

const select = css`
    &:after,
    &:before {
        display: none;
    }
`;

export class Sort extends React.Component {
    handleChange = (event) => {
        const {setOrder, options} = this.props;

        const {value: {by, direction}} = options.find(o => o.label === event.target.value);

        setOrder({by, direction});
    };

    render() {
        const {current, options} = this.props;

        return (
            <Wrapper>
                <Label htmlFor="sort">Sort by</Label>
                <Select value={current ? current.label : ''} onChange={this.handleChange} className={select}>
                    {options.map(option => (
                        <option key={option.label.replace(/ /g, '_')} value={option.label}>{option.label}</option>
                    ))}
                </Select>
            </Wrapper>
        );
    }
}

Sort.propTypes = {
    setOrder: PropTypes.func,
    current: PropTypes.shape(),
    options: PropTypes.arrayOf(PropTypes.shape()),
};

Sort.defaultProps = {
    setOrder: noop,
    current: null,
    options: [],
};

export class URLSyncedSort extends React.Component {
    componentDidMount() {
        const {location, setOrder} = this.props;

        if (location && location.query && location.query.by && location.query.direction) {
            const {by, direction} = location.query;
            setOrder({
                by,
                direction,
            });
        }
    }

    getCurrentOption = () => {
        const {options, order} = this.props;

        return options.find(option => isEqual(option.value, omit(order, ['pristine']))) || options[0];
    };

    render() {
        const {setOrder, options} = this.props;
        return <Sort current={this.getCurrentOption()} setOrder={setOrder} options={options} />;
    }
}

URLSyncedSort.propTypes = {
    setOrder: PropTypes.func,
    order: PropTypes.shape(),
    options: PropTypes.arrayOf(PropTypes.shape()),
    location: PropTypes.shape(),
};

URLSyncedSort.defaultProps = {
    setOrder: noop,
    order: null,
    options: [],
    location: null,
};

const mapStateToProps = (state, {model}) => ({
    order: state[model].order,
    location: state.location,
});

const mapDispatchToProps = (dispatch, {actions}) => bindActionCreators({
    setOrder: actions.order.set,
}, dispatch);

export const ReduxURLSyncedSort = connect(mapStateToProps, mapDispatchToProps)(URLSyncedSort);

const defaultOptions = [
    {value: {by: 'name', direction: 'asc'}, label: 'NAME (A-Z)'},
    {value: {by: 'name', direction: 'desc'}, label: 'NAME (Z-A)'},
];

const DefaultReduxURLSyncedSort = ({model, actions}) => <ReduxURLSyncedSort options={defaultOptions} model={model} actions={actions} />;

DefaultReduxURLSyncedSort.propTypes = {
    actions: PropTypes.shape().isRequired,
    model: PropTypes.string.isRequired,
};

export default DefaultReduxURLSyncedSort;
