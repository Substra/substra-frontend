import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Wrapper = styled('div')`
    font-size: 14px;
    display: inline-block;
    padding-left: 5px;
`;

const Label = styled('label')`
    margin-right: 5px;
`;

class Sort extends React.Component {
    options = [
        {value: 'name-asc', label: 'Name (A-Z)'},
        {value: 'name-desc', label: 'Name (Z-A)'},
    ];

    currentOptionValue() {
        const {order} = this.props;
        return `${order.by}-${order.direction}`;
    }

    handleChange = (event) => {
        const optionValue = event.target.value;
        const [by, direction] = optionValue.split('-');
        const {setOrder} = this.props;
        setOrder({by, direction});
    };

    render() {
        return (
            <Wrapper>
                <Label htmlFor="sort">Sort by</Label>
                <select id="sort" value={this.currentOptionValue()} onChange={this.handleChange}>
                    {this.options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
            </Wrapper>
        );
    }
}
const noop = () => {};

Sort.propTypes = {
    setOrder: PropTypes.func,
    order: PropTypes.shape({by: PropTypes.string, direction: PropTypes.string}),
};

Sort.defaultProps = {
    setOrder: noop,
    order: '',
};

export default Sort;
