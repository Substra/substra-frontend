import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Select from 'react-select';

const Wrapper = styled('div')`
    font-size: 14px;
    display: inline-block;
    padding-left: 5px;
`;

const Label = styled('label')`
    margin-right: 5px;
`;

class Sort extends React.Component {
    selectWidth = '130px';

    options = [
        {value: 'name-asc', label: 'Name (A-Z)'},
        {value: 'name-desc', label: 'Name (Z-A)'},
    ];

    currentOption() {
        const {order} = this.props;
        const currentOptionValue = `${order.by}-${order.direction}`;
        return this.options.find(option => option.value === currentOptionValue);
    }

    handleChange = (option) => {
        const [by, direction] = option.value.split('-');
        const {setOrder} = this.props;
        setOrder({by, direction});
    };

    selectStyles() {
        return {
            container: provided => ({
                ...provided,
                display: 'inline-block',
                width: this.selectWidth,
            }),
            control: provided => ({
                ...provided,
                borderRadius: '20px',
            }),
            indicatorSeparator: () => ({
                display: 'none',
            }),
        };
    }

    render() {
        return (
            <Wrapper>
                <Label htmlFor="sort">Sort by</Label>
                <Select
                    inputId="sort"
                    options={this.options}
                    styles={this.selectStyles()}
                    value={this.currentOption()}
                    onChange={this.handleChange}
                />
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
