import { IconButton, IconButtonProps, Tooltip } from '@chakra-ui/react';
import { RiDownloadLine } from 'react-icons/ri';

import { downloadBlob, downloadFromApi } from '@/libs/request';

interface DownloadIconButtonProps {
    storageAddress?: string;
    blob?: Blob;
    filename: string;
    label: string;
    variant?: IconButtonProps['variant'];
}
const DownloadIconButton = ({
    storageAddress,
    blob,
    filename,
    label,
    variant = 'solid',
}: DownloadIconButtonProps): JSX.Element => {
    const download = () => {
        if (storageAddress) {
            downloadFromApi(storageAddress, filename);
        } else if (blob) {
            downloadBlob(blob, filename);
        } else {
            console.error('No url or content specified for download');
        }
    };
    return (
        <Tooltip
            label={label}
            hasArrow={true}
            placement="top"
            borderRadius="base"
            fontSize="xs"
        >
            <IconButton
                aria-label={label}
                variant={variant}
                size="sm"
                color="gray.500"
                icon={<RiDownloadLine />}
                onClick={download}
            />
        </Tooltip>
    );
};
export default DownloadIconButton;
