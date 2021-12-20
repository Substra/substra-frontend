import { Spinner, Flex } from '@chakra-ui/react';

interface LoadingStateProps {
    message: string;
}
const LoadingState = ({ message }: LoadingStateProps): JSX.Element => (
    <Flex align="center">
        <Spinner
            color="gray.400"
            marginRight="2"
            size="sm"
            label="Loading performance data"
        />
        {message}
    </Flex>
);

export default LoadingState;
