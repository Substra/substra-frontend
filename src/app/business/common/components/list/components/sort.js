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

export default Sort;
