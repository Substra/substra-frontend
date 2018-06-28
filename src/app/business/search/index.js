import React, {Component} from 'react';
import styled, {css} from 'react-emotion';

const Wrapper = styled('div')`
    margin: 15px auto;
    width: 90%;
`;

const input = css`
    box-sizing : border-box;
    width: 100%;
    padding: 15px;
`;

class Search extends Component {

    render () {
        return (
            <Wrapper>
                <input type="text" placeholder="search" className={input}/>
            </Wrapper>
        );
    }
}

export default Search;
