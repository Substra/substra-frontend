import { useEffect } from 'react';

import Breadcrumbs from './components/BreadCrumbs';
import DetailsSidebar from './components/DetailsSidebar';
import { Box, Flex, Heading, HStack, VStack, Text } from '@chakra-ui/react';
import { unwrapResult } from '@reduxjs/toolkit';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useRoute } from 'wouter';

import {
    retrieveDataset,
    retrieveDescription,
    retrieveOpener,
} from '@/modules/datasets/DatasetsSlice';
import { DatasetType } from '@/modules/datasets/DatasetsTypes';

import { useAppDispatch, useAppSelector } from '@/hooks';
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';

import { PATHS } from '@/routes';

import CopyIconButton from '@/components/CopyIconButton';
import DownloadIconButton from '@/components/DownloadIconButton';
import MarkdownSection from '@/components/MarkdownSection';

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
                .then((dataset: DatasetType) => {
                    dispatch(
                        retrieveDescription(dataset.description.storage_address)
                    );
                    dispatch(retrieveOpener(dataset.opener.storage_address));
                });
        }
    }, [key, dataset?.key]);

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
                                <MarkdownSection source={description} />
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
                                <SyntaxHighlighter
                                    language="python"
                                    style={githubGist}
                                    showLineNumbers={true}
                                >
                                    {opener}
                                </SyntaxHighlighter>
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
