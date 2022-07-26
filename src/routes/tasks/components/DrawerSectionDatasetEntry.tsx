import { List, ListItem, Text, Link, HStack } from '@chakra-ui/react';
import { RiDatabase2Line } from 'react-icons/ri';

import AngleIcon from '@/assets/svg/angle-icon.svg';
import { DatasetStubT } from '@/modules/datasets/DatasetsTypes';
import { compilePath, PATHS } from '@/routes';

import DownloadIconButton from '@/components/DownloadIconButton';
import { DrawerSectionCollapsibleEntry } from '@/components/DrawerSection';
import IconTag from '@/components/IconTag';

type DrawerSectionDatasetEntryProps = {
    dataset: DatasetStubT;
    dataSampleKeys: string[];
};

const DrawerSectionDatasetEntry = ({
    dataset,
    dataSampleKeys,
}: DrawerSectionDatasetEntryProps): JSX.Element => {
    return (
        <DrawerSectionCollapsibleEntry
            title="Dataset"
            aboveFold={
                <>
                    <HStack spacing="2.5" onClick={(e) => e.stopPropagation()}>
                        <Text noOfLines={1}>
                            <Link
                                href={compilePath(PATHS.DATASET, {
                                    key: dataset.key,
                                })}
                                color="teal.500"
                                fontWeight="semibold"
                                isExternal
                            >
                                {dataset.name}
                            </Link>
                        </Text>
                        <DownloadIconButton
                            storageAddress={dataset.opener.storage_address}
                            filename={`opener-${dataset.key}.py`}
                            aria-label="Download opener"
                            size="xs"
                            placement="top"
                        />
                    </HStack>
                    <Text color="gray.500">
                        {dataSampleKeys.length === 1
                            ? '1 data sample'
                            : `${dataSampleKeys.length} data samples`}
                    </Text>
                </>
            }
        >
            <List spacing={2.5}>
                {dataSampleKeys.map((dataSampleKey) => (
                    <ListItem key={dataSampleKey}>
                        <HStack spacing="2.5">
                            <AngleIcon />
                            <IconTag
                                icon={RiDatabase2Line}
                                backgroundColor="gray.100"
                                fill="gray.500"
                            />
                            <Text as="span" fontSize="xs" lineHeight="4">
                                {dataSampleKey}
                            </Text>
                        </HStack>
                    </ListItem>
                ))}
            </List>
        </DrawerSectionCollapsibleEntry>
    );
};
export default DrawerSectionDatasetEntry;
