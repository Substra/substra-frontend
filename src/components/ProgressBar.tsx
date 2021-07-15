import styled from '@emotion/styled';

import { Colors } from '@/assets/theme';

type ProgressBarProps = {
    percentage: number;
};

const Container = styled.div`
    width: 100%;
    height: 10px;
    border-radius: 10px;
    background-color: ${Colors.darkerBackground};
`;

const Completed = styled.div<ProgressBarProps>`
    height: 100%;
    background-color: lightblue;
    border-radius: inherit;
    width: ${(props) => props.percentage}%;
`;

const ProgressBar = ({ percentage }: ProgressBarProps): JSX.Element => {
    return (
        <Container>
            <Completed percentage={percentage}></Completed>
        </Container>
    );
};

export default ProgressBar;
