import React, { Suspense, useEffect } from 'react';

import { useParams } from 'wouter';

import { Box, Flex, Heading, HStack, VStack, Text } from '@chakra-ui/react';

import CopyIconButton from '@/features/copy/CopyIconButton';
import useUpdateAssetName from '@/features/updateAsset/useUpdateAssetName';
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useHasPermission from '@/hooks/useHasPermission';
import MoreMenu from '@/routes/dataset/components/MoreMenu';

import DownloadIconButton from '@/components/DownloadIconButton';

import Breadcrumbs from './components/BreadCrumbs';
import DetailsSidebar from './components/DetailsSidebar';
import useDatasetStore from './useDatasetStore';

const CodeHighlighter = React.lazy(
    () => import('@/components/CodeHighlighter')
);
const MarkdownSection = React.lazy(
    () => import('@/components/MarkdownSection')
);

const Dataset = (): JSX.Element => {
    const { key } = useParams();

    const {
        dataset,
        description,
        opener,
        fetchingDescription,
        fetchingOpener,
        updatingDataset,
        fetchDataset,
        fetchDescription,
        fetchOpener,
        updateDataset,
    } = useDatasetStore();

    const hasDownloadPermission = useHasPermission();

    useEffect(() => {
        const fetchAll = async () => {
            if (key && key !== dataset?.key) {
                const dataset = await fetchDataset(key);
                if (dataset) {
                    fetchDescription(dataset.description.storage_address);
                    fetchOpener(dataset.opener.storage_address);
                }
            }
        };
        fetchAll();
    }, [key, dataset?.key, fetchDataset, fetchDescription, fetchOpener]);

    const { updateNameDialog, updateNameMenuItem } = useUpdateAssetName({
        dialogTitle: 'Rename dataset',
        asset: dataset ?? null,
        updatingAsset: updatingDataset,
        updateAsset: updateDataset,
    });

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
            <HStack
                justifyContent="space-between"
                background="white"
                borderBottomColor="gray.100"
                borderBottomStyle="solid"
                borderBottomWidth="1px"
                paddingRight="8"
            >
                <Breadcrumbs />
                <MoreMenu>{updateNameMenuItem}</MoreMenu>
                {updateNameDialog}
            </HStack>
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
                            {fetchingDescription && (
                                <Text fontSize="sm">Loading</Text>
                            )}
                            {!fetchingDescription && !description && (
                                <Text fontSize="sm">N/A</Text>
                            )}
                            {!fetchingDescription && description && (
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
                                    aria-label={
                                        dataset &&
                                        hasDownloadPermission(
                                            dataset?.permissions.download
                                        )
                                            ? 'Download opener'
                                            : "you don't have permission to download this dataset"
                                    }
                                    isDisabled={
                                        fetchingOpener ||
                                        !opener ||
                                        (!!dataset &&
                                            !hasDownloadPermission(
                                                dataset?.permissions.download
                                            ))
                                    }
                                />
                            </HStack>
                        </Heading>
                        <Box fontSize="xs">
                            {fetchingOpener && (
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
                            {!fetchingOpener && !opener && (
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
                            {!fetchingOpener && opener && (
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
