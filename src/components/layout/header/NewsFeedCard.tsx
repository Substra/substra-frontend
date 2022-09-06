import {
    Box,
    Flex,
    HStack,
    Icon,
    LinkBox,
    LinkOverlay,
    SkeletonCircle,
    SkeletonText,
    Text,
} from '@chakra-ui/react';
import { IconType } from 'react-icons';
import {
    RiCheckFill,
    RiCloseFill,
    RiInformationLine,
    RiPlayMiniLine,
    RiStackshareLine,
    RiIndeterminateCircleLine,
} from 'react-icons/ri';

import { shortFormatDate } from '@/libs/utils';
import {
    NewsItemAssetKind,
    NewsItemStatus,
    NewsItemT,
} from '@/modules/newsFeed/NewsFeedTypes';
import { getAssetKindLabel } from '@/modules/newsFeed/NewsFeedUtils';
import { TASK_CATEGORY_SLUGS } from '@/modules/tasks/TuplesTypes';
import { compilePath, PATHS } from '@/paths';

type NewsFeedCardProps = {
    newsItem: NewsItemT;
};

type StatusDescriptionT = {
    text: string;
    color: string;
    icon: IconType;
};

type TaskMetadataT = Record<NewsItemStatus, StatusDescriptionT>;

const taskMetadata: TaskMetadataT = {
    STATUS_CREATED: {
        text: 'has been created',
        color: 'gray',
        icon: RiInformationLine,
    },
    STATUS_DOING: {
        text: 'is doing',
        color: 'blue',
        icon: RiPlayMiniLine,
    },
    STATUS_FAILED: {
        text: 'has failed',
        color: 'red',
        icon: RiCloseFill,
    },
    STATUS_DONE: {
        text: 'is done',
        color: 'primary',
        icon: RiCheckFill,
    },
    STATUS_CANCELED: {
        text: 'has been canceled',
        color: 'gray',
        icon: RiIndeterminateCircleLine,
    },
};

const COMPUTE_PLAN_STATUS_PATH: Record<NewsItemStatus, string> = {
    STATUS_CREATED: PATHS.COMPUTE_PLAN_TASKS_ROOT,
    STATUS_DOING: PATHS.COMPUTE_PLAN_TASKS_ROOT,
    STATUS_DONE: PATHS.COMPUTE_PLAN_CHART,
    STATUS_FAILED: PATHS.COMPUTE_PLAN_TASK,
    STATUS_CANCELED: PATHS.COMPUTE_PLAN_TASKS_ROOT,
};
const NON_CP_PATH: Record<
    Exclude<NewsItemAssetKind, NewsItemAssetKind.computePlan>,
    string
> = {
    ASSET_ALGO: PATHS.ALGO,
    ASSET_DATA_MANAGER: PATHS.DATASET,
};
const getItemPath = (newsItem: NewsItemT): string => {
    if (newsItem.asset_kind === NewsItemAssetKind.computePlan) {
        return COMPUTE_PLAN_STATUS_PATH[newsItem.status];
    }

    return NON_CP_PATH[newsItem.asset_kind];
};

const getItemHref = (newsItem: NewsItemT): string => {
    const path = getItemPath(newsItem);
    if (
        newsItem.asset_kind === NewsItemAssetKind.computePlan &&
        newsItem.status === NewsItemStatus.failed
    ) {
        return compilePath(path, {
            key: newsItem.asset_key,
            taskKey: newsItem.detail.first_failed_task_key || '',
            category: TASK_CATEGORY_SLUGS[newsItem.detail.task_category] || '',
        });
    }

    return compilePath(path, { key: newsItem.asset_key });
};

export const NewsFeedCardSkeleton = (): JSX.Element => {
    return (
        <Box
            backgroundColor="white"
            paddingY="5"
            paddingRight="8"
            paddingLeft="4"
            marginBottom="1"
            position="relative"
        >
            {/* Icon */}
            <SkeletonCircle size="10" position="absolute" />
            {/* Content */}
            <SkeletonText
                marginTop="1"
                marginLeft="20"
                noOfLines={3}
                spacing="1"
            />
        </Box>
    );
};

export const NewsFeedCard = ({ newsItem }: NewsFeedCardProps): JSX.Element => {
    const taskStatus = newsItem.status;

    return (
        <LinkBox>
            <Flex
                flexDirection="row"
                backgroundColor="white"
                paddingY="5"
                paddingRight="8"
                paddingLeft="4"
                marginBottom="1"
                _hover={{ backgroundColor: 'gray.50' }}
            >
                {/* Icon */}
                <Box position="relative">
                    <Box
                        height="10"
                        width="10"
                        borderRadius="20"
                        backgroundColor={`${taskMetadata[taskStatus]['color']}.100`}
                    >
                        <Icon
                            as={taskMetadata[taskStatus]['icon']}
                            color={`${taskMetadata[taskStatus]['color']}.600`}
                            height="5"
                            width="5"
                            position="absolute"
                            top="2.5"
                            left="2.5"
                        />
                    </Box>
                    {newsItem.asset_kind === 'ASSET_COMPUTE_PLAN' && (
                        <Box
                            height="4"
                            width="4"
                            backgroundColor="purple.700"
                            border="1px solid white"
                            borderRadius="3"
                            position="absolute"
                            top="7"
                            right="-1"
                        >
                            <Icon
                                as={RiStackshareLine}
                                color="white"
                                height="3"
                                width="3"
                                position="absolute"
                                top="1px"
                                left="1px"
                            />
                        </Box>
                    )}
                </Box>
                {/* Content */}
                <Flex flexDirection="column" marginLeft="4">
                    <HStack spacing="1">
                        <Text
                            fontSize="xs"
                            color={`${taskMetadata[taskStatus]['color']}.500`}
                            fontWeight="500"
                        >
                            {getAssetKindLabel(newsItem.asset_kind)}
                        </Text>
                        <Text fontSize="xs" color="gray.500" fontWeight="500">
                            • {shortFormatDate(newsItem.timestamp)}
                        </Text>
                    </HStack>
                    <Box fontSize="xs">
                        <Text as="span" wordBreak="break-all">
                            {newsItem.name}
                        </Text>
                        <Text as="span" color="gray.500">
                            {' '}
                            {taskMetadata[taskStatus]['text']}
                        </Text>
                    </Box>
                    <LinkOverlay
                        href={getItemHref(newsItem)}
                        _hover={{ textDecoration: 'underline' }}
                    >
                        {taskStatus === 'STATUS_FAILED' && (
                            <Text
                                fontSize="xs"
                                color="gray.700"
                                fontWeight="bold"
                                marginTop="1"
                            >
                                See failed task
                            </Text>
                        )}
                        {taskStatus === 'STATUS_DONE' && (
                            <Text
                                fontSize="xs"
                                color="gray.700"
                                fontWeight="bold"
                                marginTop="1"
                            >
                                See results
                            </Text>
                        )}
                    </LinkOverlay>
                </Flex>
            </Flex>
        </LinkBox>
    );
};
