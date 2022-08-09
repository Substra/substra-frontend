import React, { Suspense, useEffect } from 'react';

import { unwrapResult } from '@reduxjs/toolkit';
import { useRoute } from 'wouter';

import { Box, Flex, Heading, HStack, VStack, Text } from '@chakra-ui/react';

import useAppDispatch from '@/hooks/useAppDispatch';
import useAppSelector from '@/hooks/useAppSelector';
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import {
    retrieveDataset,
    retrieveDescription,
    retrieveOpener,
} from '@/modules/datasets/DatasetsSlice';
import { DatasetT } from '@/modules/datasets/DatasetsTypes';
import { PATHS } from '@/paths';

import CopyIconButton from '@/components/CopyIconButton';
import DownloadIconButton from '@/components/DownloadIconButton';

import Breadcrumbs from './components/BreadCrumbs';
import DetailsSidebar from './components/DetailsSidebar';

const CodeHighlighter = React.lazy(
    () => import('@/components/CodeHighlighter')
);
const MarkdownSection = React.lazy(
    () => import('@/components/MarkdownSection')
);

const Dataset = (): JSX.Element => {
    const [, params] = useRoute(PATHS.DATASET);
    const key = params?.key;

    const dataset = useAppSelector((state) => state.datasets.dataset);
    const description = useAppSelector((state) => state.datasets.description);
    const descriptionLoading = useAppSelector(
        (state) => state.datasets.descriptionLoading
    );
    const opener = useAppSelector((state) => state.datasets.opener);
    const openerLoading = useAppSelector(
        (state) => state.datasets.openerLoading
    );

    const dispatch = useAppDispatch();
    useEffect(() => {
        if (key && key !== dataset?.key) {
            dispatch(retrieveDataset(key))
                .then(unwrapResult)
                .then((dataset: DatasetT) => {
                    dispatch(
                        retrieveDescription(dataset.description.storage_address)
                    );
                    dispatch(retrieveOpener(dataset.opener.storage_address));
                });
        }
    }, [key, dataset?.key, dispatch]);

    useDocumentTitleEffect(
        (setDocumentTitle) => {
            if (dataset?.name) {
                setDocumentTitle(dataset.name);
            }
        },
        [dataset?.name]
    );

    return (
        <Flex
            direction="column"
            alignItems="stretch"
            flexGrow={1}
            overflow="hidden"
        >
            <Box
                background="white"
                borderBottomColor="gray.100"
                borderBottomStyle="solid"
                borderBottomWidth="1px"
            >
                <Breadcrumbs />
            </Box>
            <HStack
                spacing="16"
                padding="8"
                justifyContent="center"
                alignItems="flex-start"
                overflow="auto"
                flexGrow={1}
            >
                <VStack spacing="8" flexGrow={1} alignItems="stretch">
                    <Box
                        backgroundColor="white"
                        borderWidth="1px"
                        borderStyle="solid"
                        borderColor="gray.100"
                    >
                        <Heading
                            size="xs"
                            fontWeight="bold"
                            textTransform="uppercase"
                            borderBottomWidth="1px"
                            borderBottomStyle="solid"
                            borderBottomColor="gray.100"
                            paddingLeft="5"
                            paddingRight="5"
                            paddingTop="3"
                            paddingBottom="3"
                        >
                            Description
                        </Heading>
                        <Box
                            paddingLeft="12"
                            paddingRight="12"
                            paddingTop="5"
                            paddingBottom="5"
                        >
                            {descriptionLoading && (
                                <Text fontSize="sm">Loading</Text>
                            )}
                            {!descriptionLoading && !description && (
                                <Text fontSize="sm">N/A</Text>
                            )}
                            {!descriptionLoading && description && (
                                <Suspense fallback={<Text>Loading</Text>}>
                                    <MarkdownSection source={description} />
                                </Suspense>
                            )}
                        </Box>
                    </Box>
                    <Box
                        backgroundColor="white"
                        borderWidth="1px"
                        borderStyle="solid"
                        borderColor="gray.100"
                    >
                        <Heading
                            size="xs"
                            fontWeight="bold"
                            textTransform="uppercase"
                            borderBottomWidth="1px"
                            borderBottomStyle="solid"
                            borderBottomColor="gray.100"
                            padding="3"
                            paddingLeft="5"
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            Opener
                            <HStack>
                                <CopyIconButton
                                    value={opener}
                                    size="sm"
                                    aria-label="Copy code"
                                />
                                <DownloadIconButton
                                    storageAddress={
                                        dataset
                                            ? dataset.opener.storage_address
                                            : ''
                                    }
                                    filename="opener.py"
                                    aria-label="Download opener.py"
                                />
                            </HStack>
                        </Heading>
                        <Box fontSize="xs">
                            {openerLoading && (
                                <Text
                                    paddingLeft="12"
                                    paddingRight="12"
                                    paddingTop="5"
                                    paddingBottom="5"
                                    fontSize="sm"
                                >
                                    Loading
                                </Text>
                            )}
                            {!openerLoading && !opener && (
                                <Text
                                    paddingLeft="12"
                                    paddingRight="12"
                                    paddingTop="5"
                                    paddingBottom="5"
                                    fontSize="sm"
                                >
                                    N/A
                                </Text>
                            )}
                            {!openerLoading && opener && (
                                <Suspense
                                    fallback={
                                        <Text
                                            paddingLeft="12"
                                            paddingRight="12"
                                            paddingTop="5"
                                            paddingBottom="5"
                                            fontSize="sm"
                                        >
                                            Loading
                                        </Text>
                                    }
                                >
                                    <CodeHighlighter
                                        language="python"
                                        children={opener}
                                    />
                                </Suspense>
                            )}
                        </Box>
                    </Box>
                </VStack>
                <DetailsSidebar />
            </HStack>
        </Flex>
    );
};
export default Dataset;
