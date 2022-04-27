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
    NewsItemStatus,
    NewsItemType,
    taskCategoryByCategoryNumber,
} from '@/modules/newsFeed/NewsFeedTypes';
import { getAssetKindLabel } from '@/modules/newsFeed/NewsFeedUtils';
import { compilePath, PATHS, TASK_CATEGORY_SLUGS } from '@/routes';

interface NewsFeedCardProps {
    newsItem: NewsItemType;
}

interface StatusDescription {
    text: string;
    color: string;
    icon: IconType;
    path: string;
}

type TaskMetadataT = Record<NewsItemStatus, StatusDescription>;

const taskMetadata: TaskMetadataT = {
    STATUS_CREATED: {
        text: 'has been created',
        color: 'gray',
        icon: RiInformationLine,
        path: PATHS.COMPUTE_PLAN,
    },
    STATUS_DOING: {
        text: 'is doing',
        color: 'blue',
        icon: RiPlayMiniLine,
        path: PATHS.COMPUTE_PLAN_TASKS,
    },
    STATUS_FAILED: {
        text: 'has failed',
        color: 'red',
        icon: RiCloseFill,
        path: PATHS.COMPUTE_PLAN_TASK,
    },
    STATUS_DONE: {
        text: 'is done',
        color: 'teal',
        icon: RiCheckFill,
        path: PATHS.COMPUTE_PLAN_CHART,
    },
    STATUS_CANCELED: {
        text: 'has been canceled',
        color: 'gray',
        icon: RiIndeterminateCircleLine,
        path: PATHS.COMPUTE_PLAN_TASKS,
    },
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
                        href={compilePath(taskMetadata[taskStatus].path, {
                            key: newsItem.asset_key,
                            taskKey:
                                newsItem.detail.first_failed_task_key || '',
                            category:
                                TASK_CATEGORY_SLUGS[
                                    taskCategoryByCategoryNumber[
                                        newsItem.detail.task_category
                                    ]
                                ] || '',
                        })}
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
