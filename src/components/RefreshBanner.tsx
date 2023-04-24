import { useEffect, useState, useMemo } from 'react';

import { useLocation } from 'wouter';

import { HStack, Icon, Button, Text } from '@chakra-ui/react';
import { RiInformationLine } from 'react-icons/ri';

import * as NewsFeedApi from '@/api/NewsFeedApi';
import { ACTUALIZE_NEWS_INTERVAL } from '@/features/newsFeed/NewsFeedUtils';
import useFavoriteComputePlans from '@/hooks/useFavoriteComputePlans';
import {
    usePage,
    useMatch,
    useStatus,
    useFavoritesOnly,
    useCreationDate,
    useStartDate,
    useEndDate,
    useDuration,
    useMetadataString,
    useOrdering,
} from '@/hooks/useSyncedState';
import { PATHS } from '@/paths';
import useComputePlansStore from '@/routes/computePlans/useComputePlansStore';

const RefreshBanner = (): JSX.Element | null => {
    const [location] = useLocation();
    const [page] = usePage();
    const [match] = useMatch();
    const [status] = useStatus();
    const [favoritesOnly] = useFavoritesOnly();
    const { creationDateBefore, creationDateAfter } = useCreationDate();
    const { startDateBefore, startDateAfter } = useStartDate();
    const { endDateBefore, endDateAfter } = useEndDate();
    const { durationMin, durationMax } = useDuration();
    const [metadata] = useMetadataString();
    const [ordering] = useOrdering('');

    const [refreshAvailable, setRefreshAvailable] = useState(false);
    const { computePlansCallTimestamp, fetchComputePlans } =
        useComputePlansStore();

    const { favorites } = useFavoriteComputePlans();

    const key = useMemo(() => {
        return favoritesOnly ? favorites : null;
    }, [favoritesOnly, favorites]);

    const filters = {
        creation_date_after: creationDateAfter,
        creation_date_before: creationDateBefore,
        duration_max: durationMax,
        duration_min: durationMin,
        end_date_after: endDateAfter,
        end_date_before: endDateBefore,
        key: key,
        match: match,
        metadata: metadata,
        start_date_after: startDateAfter,
        start_date_before: startDateBefore,
        status: status,
    };

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
                onClick={() =>
                    fetchComputePlans({
                        page,
                        ordering,
                        ...filters,
                    })
                }
            >
                Refresh
            </Button>
        </HStack>
    );
};

export default RefreshBanner;
