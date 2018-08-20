import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled, {css} from 'react-emotion';

const Wrapper = styled('div')`
    
`;

const Top = styled('div')`
    background-color: #f7f8f8;
    padding: 3px 10px;
    color: #4b6073;
`;

const H5 = styled('h5')`
    margin: 0;
    display: inline-block;
    padding-right: 5px;
    color: #edc20f;
`;

const Item = styled('div')`
    font-size: 12px;
`;

const Detail = ({selected, model, className}) => (
    <Wrapper className={className}>
        <Top>
            <H5>{model.toUpperCase()}</H5>
        </Top>
        <Item>
            {selected}
        </Item>
    </Wrapper>
);

const mapStateToProps = (state, {model}) => ({
    model,
    selected: state[model].list.selected,
});

Detail.defaultProps = {
    selected: '',
    className: '',
};

Detail.propTypes = {
    selected: PropTypes.string,
    className: PropTypes.string,
};

export default connect(mapStateToProps)(Detail);
