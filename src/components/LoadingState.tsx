import styled from '@emotion/styled';

import Spinner from '@/components/Spinner';

import { Colors, Spaces } from '@/assets/theme';

const SpinnerContainer = styled.div`
    display: flex;
    align-items: center;
    color: ${Colors.lightContent};

    & > svg {
        margin-right: ${Spaces.small};
    }
`;

interface LoadingStateProps {
    message: string;
}
const LoadingState = ({ message }: LoadingStateProps): JSX.Element => (
    <SpinnerContainer>
        <Spinner />
        {message}
    </SpinnerContainer>
);

export default LoadingState;
