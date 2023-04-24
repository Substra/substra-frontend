import { VStack } from '@chakra-ui/react';

import {
    DrawerSection,
    DrawerSectionDateEntry,
    DrawerSectionKeyEntry,
    OrganizationDrawerSectionEntry,
    PermissionsDrawerSectionEntry,
} from '@/components/DrawerSection';
import MetadataDrawerSection from '@/components/MetadataDrawerSection';

import useDatasetStore from '../useDatasetStore';
import DataSamplesDrawerSection from './DataSamplesDrawerSection';

const DetailsSidebar = (): JSX.Element => {
    const { dataset } = useDatasetStore();
    return (
        <VStack spacing="8" width="md" alignItems="stretch" flexShrink="0">
            <DrawerSection title="General">
                {dataset && (
                    <>
                        <DrawerSectionKeyEntry value={dataset.key} />
                        <DrawerSectionDateEntry
                            title="Created"
                            date={dataset.creation_date}
                        />
                        <OrganizationDrawerSectionEntry
                            title="Owner"
                            organization={dataset.owner}
                        />
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
                <DataSamplesDrawerSection keys={dataset.data_sample_keys} />
            )}
        </VStack>
    );
};

export default DetailsSidebar;
