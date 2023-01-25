import {
    IconButton,
    IconButtonProps,
    Tooltip,
    TooltipProps,
} from '@chakra-ui/react';
import { RiDownloadLine } from 'react-icons/ri';

import { downloadBlob, downloadFromApi } from '@/api/request';

type DownloadIconButtonProps = IconButtonProps & {
    storageAddress?: string;
    blob?: Blob;
    filename: string;
    placement?: TooltipProps['placement'];
};
const DownloadIconButton = ({
    storageAddress,
    blob,
    filename,
    placement,
    ...props
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
            label={props['aria-label']}
            hasArrow={true}
            placement={placement || 'top-end'}
            fontSize="xs"
        >
            <IconButton
                size="sm"
                color="gray.500"
                icon={<RiDownloadLine />}
                onClick={download}
                {...props}
            />
        </Tooltip>
    );
};
export default DownloadIconButton;
