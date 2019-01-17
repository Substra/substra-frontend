import styled from '@emotion/styled';
import {ice} from '../../../../../assets/css/variables/colors';

export default styled('button')`
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background-color: none;
    border: none;
    width: 30px;
    height: 30px;
    border-radius: 15px;
    
    &:hover {
        background-color: ${ice};
        transition: background-color 200ms ease-out;
    }
`;
