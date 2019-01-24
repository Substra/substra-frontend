import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import {withStyles} from '@material-ui/core';
import NativeSelect from '@material-ui/core/NativeSelect';
import {css} from 'emotion';
import {noop} from 'lodash';
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

class Sort extends React.Component {
    options = [
        {value: 'name-asc', label: 'NAME (A-Z)'},
        {value: 'name-desc', label: 'NAME (Z-A)'},
    ];

    currentOption() {
        const {order} = this.props;
        const currentOptionValue = `${order.by}-${order.direction}`;
        return this.options.find(option => option.value === currentOptionValue);
    }

    handleChange = (event) => {
        const [by, direction] = event.target.value.split('-');
        const {setOrder} = this.props;
        setOrder({by, direction});
    };

    render() {
        return (
            <Wrapper>
                <Label htmlFor="sort">Sort by</Label>
                <Select value={this.currentOption().value} onChange={this.handleChange} className={select}>
                    {this.options.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </Select>
            </Wrapper>
        );
    }
}

Sort.propTypes = {
    setOrder: PropTypes.func,
    order: PropTypes.shape({by: PropTypes.string, direction: PropTypes.string}),
};

Sort.defaultProps = {
    setOrder: noop,
    order: '',
};

export default Sort;
