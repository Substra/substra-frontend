import DataSamplesListItem from './DataSamplesListItem';
import { VStack, Badge, List } from '@chakra-ui/react';

import { useAppSelector } from '@/hooks';

import DrawerSectionHeading from '@/components/DrawerSectionHeading';
import MetadataDrawerSection from '@/components/MetadataDrawerSection';
import PermissionTag from '@/components/PermissionTag';
import {
    TableDrawerSection,
    TableDrawerSectionDateEntry,
    TableDrawerSectionEntry,
    TableDrawerSectionKeyEntry,
} from '@/components/TableDrawerSection';

const DetailsSidebar = (): JSX.Element => {
    const dataset = useAppSelector((state) => state.datasets.dataset);
    return (
        <VStack spacing="8" width="xs" alignItems="stretch">
            <TableDrawerSection title="General">
                {dataset && (
                    <>
                        <TableDrawerSectionKeyEntry
                            value={dataset.key}
                            maxWidth="180px"
                        />
                        <TableDrawerSectionDateEntry
                            title="Created"
                            date={dataset.creation_date}
                        />
                        <TableDrawerSectionEntry title="Owner">
                            {dataset.owner}
                        </TableDrawerSectionEntry>
                        <TableDrawerSectionEntry title="Permissions">
                            <PermissionTag
                                permission={dataset.permissions.process}
                                listNodes={true}
                            />
                        </TableDrawerSectionEntry>
                    </>
                )}
            </TableDrawerSection>
            {dataset && <MetadataDrawerSection metadata={dataset.metadata} />}
            {dataset && (
                <VStack spacing={5} alignItems="flex-start">
                    <DrawerSectionHeading title="Data samples">
                        <Badge
                            variant="subtle"
                            colorScheme="gray"
                            marginLeft="1.5"
                        >
                            {dataset.train_data_sample_keys.length +
                                dataset.test_data_sample_keys.length}
                        </Badge>
                    </DrawerSectionHeading>
                    <List alignSelf="stretch">
                        <DataSamplesListItem
                            type="train"
                            keys={dataset.train_data_sample_keys}
                        />
                        <DataSamplesListItem
                            type="test"
                            keys={dataset.test_data_sample_keys}
                        />
                    </List>
                </VStack>
            )}
        </VStack>
    );
};

export default DetailsSidebar;
