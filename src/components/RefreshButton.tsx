import { Button, ButtonProps } from '@chakra-ui/react';

const RefreshButton = (props: ButtonProps): JSX.Element => {
    return (
        <Button size="sm" variant="outline" loadingText="Loading" {...props}>
            Refresh
        </Button>
    );
};

export default RefreshButton;
