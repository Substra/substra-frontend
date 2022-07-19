import { Button } from '@chakra-ui/react';

import { DispatchWithAutoAbortProps } from '@/hooks/useDispatchWithAutoAbort';
import useHandleRefresh, { ActionBuilderT } from '@/hooks/useHandleRefresh';

const RefreshButton = ({
    loading,
    actionBuilder,
    dispatchWithAutoAbort,
}: {
    loading: boolean;
    actionBuilder: ActionBuilderT;
    dispatchWithAutoAbort: DispatchWithAutoAbortProps;
}): JSX.Element => {
    const handleRefresh = useHandleRefresh(
        actionBuilder,
        dispatchWithAutoAbort
    );
    return (
        <Button
            size="sm"
            variant="outline"
            onClick={handleRefresh}
            isLoading={loading}
            loadingText="Loading"
        >
            Refresh
        </Button>
    );
};

export default RefreshButton;
