import { useEffect, useState } from 'react';

import { useLocation } from 'wouter';

import { HStack, Icon, Button, Text } from '@chakra-ui/react';
import { RiInformationLine } from 'react-icons/ri';

import useAppSelector from '@/hooks/useAppSelector';
import useHandleRefresh from '@/hooks/useHandleRefresh';
import { listComputePlans } from '@/modules/computePlans/ComputePlansSlice';
import * as NewsFeedApi from '@/modules/newsFeed/NewsFeedApi';
import { ACTUALIZE_NEWS_INTERVAL } from '@/modules/newsFeed/NewsFeedUtils';
import { PATHS } from '@/paths';

const RefreshBanner = (): JSX.Element | null => {
    const [location] = useLocation();
    const [refreshAvailable, setRefreshAvailable] = useState(false);
    const computePlansCallTimestamp = useAppSelector(
        (state) => state.computePlans.computePlansCallTimestamp
    );

    const handleRefresh = useHandleRefresh(() =>
        listComputePlans({ page: 1, ordering: '-creation_date' })
    );

    useEffect(() => {
        const updateBanner = async () => {
            const response = await NewsFeedApi.listNewsFeed(
                {
                    page: 1,
                    pageSize: 0,
                    timestamp_after: computePlansCallTimestamp,
                    important_news_only: true,
                },
                {}
            );
            setRefreshAvailable(response.data.count > 0);
        };

        if (location === PATHS.COMPUTE_PLANS) {
            const interval = setInterval(updateBanner, ACTUALIZE_NEWS_INTERVAL);
            return () => clearInterval(interval);
        }
    }, [computePlansCallTimestamp, location]);

    useEffect(() => {
        // the user just refreshed the compute plan list, let's hide the banner
        setRefreshAvailable(false);
    }, [computePlansCallTimestamp]);

    if (location !== PATHS.COMPUTE_PLANS || !refreshAvailable) {
        return null;
    }

    return (
        <HStack
            background="primary.100"
            justify="center"
            alignItems="center"
            spacing="2"
            color="primary.700"
        >
            <Icon as={RiInformationLine} height="13px" width="13px" />
            <Text fontSize="sm">New important updates are available</Text>
            <Button
                variant="ghost"
                colorScheme="primary"
                size="sm"
                lineHeight="1"
                onClick={handleRefresh}
            >
                Refresh
            </Button>
        </HStack>
    );
};

export default RefreshBanner;
