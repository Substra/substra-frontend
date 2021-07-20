import styled from '@emotion/styled';
import { RiCheckboxBlankLine, RiCheckboxFill } from 'react-icons/ri';

import { Colors } from '@/assets/theme';

const Container = styled.div`
    display: inline-block;
    position: relative;
    color: ${Colors.primary};

    svg {
        width: 20px;
        height: 20px;
        position: absolute;
        top: -2px;
        left: 0;
        pointer-events: none;
        transition: opacity 0.1s ease-out;
    }

    // targets the first svg (unchecked)
    input:checked + svg {
        opacity: 0;
    }
    input:not(:checked) + svg {
        opacity: 1;
    }

    // targets the last svg (checked)
    input:checked ~ svg:last-child {
        opacity: 1;
    }
    input:not(:checked) ~ svg:last-child {
        opacity: 0;
    }
`;

const Input = styled.input`
    opacity: 0;
`;

const Checkbox = (props: React.ComponentPropsWithRef<'input'>): JSX.Element => {
    return (
        <Container>
            <Input type="checkbox" {...props} />
            <RiCheckboxBlankLine />
            <RiCheckboxFill />
        </Container>
    );
};
export default Checkbox;
