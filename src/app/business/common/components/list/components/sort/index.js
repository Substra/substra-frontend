import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import {isEqual, omit, noop} from 'lodash';

import {spacingExtraSmall} from '../../../../../../../../assets/css/variables/spacing';
import {fontNormal} from '../../../../../../../../assets/css/variables/font';
import Select from '../../../select';

const Wrapper = styled('div')`
    font-size: ${fontNormal};
    display: inline-block;
`;

const Label = styled('label')`
    margin-right: ${spacingExtraSmall};
`;


class Sort extends Component {
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

        return options.find((option) => isEqual(option.value, omit(order, ['pristine']))) || options[0];
    };


    handleChange = (event) => {
        const {setOrder, options} = this.props;

        const {value: {by, direction}} = options.find((o) => o.label === event.target.value);

        setOrder({by, direction});
    };

    render() {
        const {options} = this.props;
        const currentOption = this.getCurrentOption();

        return (
            <Wrapper>
                <Label htmlFor="sort">Sort by</Label>
                <Select
                    value={currentOption ? currentOption.label : ''}
                    onChange={this.handleChange}
                    data-testid="select"
                >
                    {options.map((option) => (
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
