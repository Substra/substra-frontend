import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import {withStyles} from '@material-ui/core';
import NativeSelect from '@material-ui/core/NativeSelect';
import {css} from 'emotion';
import {isEqual, omit, noop} from 'lodash';

import {ice, slate} from '../../../../../../../../assets/css/variables/colors';
import {spacingExtraSmall, spacingLarge, spacingSmall} from '../../../../../../../../assets/css/variables/spacing';
import {fontNormal} from '../../../../../../../../assets/css/variables/font';

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

class Sort extends React.Component {
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


    handleChange = (event) => {
        const {setOrder, options} = this.props;

        const {value: {by, direction}} = options.find(o => o.label === event.target.value);

        setOrder({by, direction});
    };

    render() {
        const {options} = this.props;
        const currentOption = this.getCurrentOption();

        return (
            <Wrapper>
                <Label htmlFor="sort">Sort by</Label>
                <Select value={currentOption ? currentOption.label : ''} onChange={this.handleChange} className={select}>
                    {options.map(option => (
                        <option key={option.label.replace(/ /g, '_')} value={option.label}>{option.label}</option>
                    ))}
                </Select>
            </Wrapper>
        );
    }
}

const defaultOptions = [
    {value: {by: 'name', direction: 'asc'}, label: 'NAME (A-Z)'},
    {value: {by: 'name', direction: 'desc'}, label: 'NAME (Z-A)'},
];

Sort.propTypes = {
    setOrder: PropTypes.func,
    order: PropTypes.shape(),
    options: PropTypes.arrayOf(PropTypes.shape()),
    location: PropTypes.shape(),
};

Sort.defaultProps = {
    setOrder: noop,
    order: null,
    options: defaultOptions,
    location: null,
};

export default Sort;
