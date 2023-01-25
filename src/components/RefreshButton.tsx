import { Button } from '@chakra-ui/react';

const RefreshButton = ({
    loading,
    list,
}: {
    loading: boolean;
    list: () => void;
}): JSX.Element => {
    return (
        <Button
            size="sm"
            variant="outline"
            onClick={list}
            isLoading={loading}
            loadingText="Loading"
        >
            Refresh
        </Button>
    );
};

export default RefreshButton;
