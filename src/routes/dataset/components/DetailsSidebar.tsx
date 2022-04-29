import { VStack, Badge, List } from '@chakra-ui/react';

import useAppSelector from '@/hooks/useAppSelector';

import {
    DrawerSection,
    DrawerSectionDateEntry,
    DrawerSectionEntry,
    DrawerSectionKeyEntry,
    PermissionsDrawerSectionEntry,
} from '@/components/DrawerSection';
import { DrawerSectionHeading } from '@/components/DrawerSection';
import MetadataDrawerSection from '@/components/MetadataDrawerSection';

import DataSamplesListItem from './DataSamplesListItem';

const DetailsSidebar = (): JSX.Element => {
    const dataset = useAppSelector((state) => state.datasets.dataset);
    return (
        <VStack spacing="8" width="md" alignItems="stretch">
            <DrawerSection title="General">
                {dataset && (
                    <>
                        <DrawerSectionKeyEntry value={dataset.key} />
                        <DrawerSectionDateEntry
                            title="Created"
                            date={dataset.creation_date}
                        />
                        <DrawerSectionEntry title="Owner">
                            {dataset.owner}
                        </DrawerSectionEntry>
                        <PermissionsDrawerSectionEntry
                            permission={dataset.permissions.process}
                        />
                        <PermissionsDrawerSectionEntry
                            title="Logs permissions"
                            permission={dataset.logs_permission}
                        />
                    </>
                )}
            </DrawerSection>
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
