import { HStack, ListItem, Text } from '@chakra-ui/react';
import { RiDatabase2Fill } from 'react-icons/ri';

import CopyIconButton from '@/components/CopyIconButton';
import DownloadIconButton from '@/components/DownloadIconButton';
import IconTag from '@/components/IconTag';

type DataSamplesListItemProps = {
    keys: string[];
    type: 'train' | 'test';
};
const DataSamplesListItem = ({
    keys,
    type,
}: DataSamplesListItemProps): JSX.Element => {
    const keysAsJson = JSON.stringify(keys);
    const keysAsBlob = new Blob([keysAsJson], { type: 'application/json' });
    return (
        <ListItem display="flex" justifyContent="space-between">
            <HStack spacing="2.5">
                <IconTag
                    icon={RiDatabase2Fill}
                    backgroundColor="gray.100"
                    fill="gray.500"
                />
                <Text fontSize="xs">{`${keys.length} ${type} data samples`}</Text>
            </HStack>
            {keys.length > 0 && (
                <HStack spacing="0.5">
                    <CopyIconButton
                        aria-label={`Copy ${type} data samples keys as JSON`}
                        variant="ghost"
                        value={keysAsJson}
                        size="sm"
                    />
                    <DownloadIconButton
                        aria-label={`Download ${type} data samples keys as JSON`}
                        variant="ghost"
                        blob={keysAsBlob}
                        filename={`${type}_data_sample_keys.json`}
                    />
                </HStack>
            )}
        </ListItem>
    );
};
export default DataSamplesListItem;
