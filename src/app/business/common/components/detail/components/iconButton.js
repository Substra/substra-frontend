import styled from '@emotion/styled';
import {ice} from '../../../../../../../assets/css/variables/colors';

export default styled('button')`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 15px;
    border: 1px solid ${ice};
    padding: 0;
    background: none;
    cursor: pointer;
    
    &:hover {
        background-color: ${ice};
        transition: background-color 200ms ease-out;
    }
`;
