import { List, ListItem, Text, Link, HStack } from '@chakra-ui/react';
import { RiDatabase2Line } from 'react-icons/ri';

import AngleIcon from '@/assets/svg/angle-icon.svg';
import { DatasetStubType } from '@/modules/datasets/DatasetsTypes';
import { compilePath, PATHS } from '@/routes';

import {
    DrawerSectionCollapsibleEntry,
    DRAWER_SECTION_COLLAPSIBLE_ENTRY_LINK_MAX_WIDTH,
} from '@/components/DrawerSection';
import IconTag from '@/components/IconTag';

interface DrawerSectionDatasetEntry {
    dataset: DatasetStubType;
    dataSampleKeys: string[];
}

const DrawerSectionDatasetEntry = ({
    dataset,
    dataSampleKeys,
}: DrawerSectionDatasetEntry): JSX.Element => {
    return (
        <DrawerSectionCollapsibleEntry
            title="Dataset"
            aboveFold={
                <>
                    <Text
                        noOfLines={1}
                        maxWidth={
                            DRAWER_SECTION_COLLAPSIBLE_ENTRY_LINK_MAX_WIDTH
                        }
                    >
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
