import { HStack, Text } from '@chakra-ui/react';
import { RiDatabase2Fill } from 'react-icons/ri';

import CopyIconButton from '@/features/copy/CopyIconButton';

import DownloadIconButton from '@/components/DownloadIconButton';
import {
    DrawerSection,
    DrawerSectionEntryWrapper,
} from '@/components/DrawerSection';
import IconTag from '@/components/IconTag';

type DataSamplesDrawerSectionProps = {
    keys: string[];
};
const DataSamplesDrawerSection = ({
    keys,
}: DataSamplesDrawerSectionProps): JSX.Element => {
    const keysAsJson = JSON.stringify(keys);
    const keysAsBlob = new Blob([keysAsJson], { type: 'application/json' });
    return (
        <DrawerSection title="Data samples">
            <DrawerSectionEntryWrapper
                display="flex"
                alignSelf="strech"
                justifyContent="space-between"
            >
                <HStack spacing="2.5">
                    <IconTag
                        icon={RiDatabase2Fill}
                        backgroundColor="gray.100"
                        fill="gray.500"
                    />
                    <Text fontSize="xs">{`${keys.length} data samples`}</Text>
                </HStack>
                {keys.length > 0 && (
                    <HStack spacing="0.5">
                        <CopyIconButton
                            aria-label={`Copy data samples keys as JSON`}
                            variant="ghost"
                            value={keysAsJson}
                            size="sm"
                        />
                        <DownloadIconButton
                            aria-label={`Download data samples keys as JSON`}
                            variant="ghost"
                            blob={keysAsBlob}
                            filename={`data_sample_keys.json`}
                        />
                    </HStack>
                )}
            </DrawerSectionEntryWrapper>
        </DrawerSection>
    );
};
export default DataSamplesDrawerSection;
