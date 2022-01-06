import { RefObject, useContext } from 'react';

import {
    Button,
    Icon,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
} from '@chakra-ui/react';
import { toJpeg } from 'html-to-image';
import { RiDownloadLine } from 'react-icons/ri';

import { SerieT } from '@/modules/series/SeriesTypes';

import useDownloadPerfCsv from '@/hooks/useDownloadPerfCsv';
import { PerfBrowserContext } from '@/hooks/usePerfBrowser';

interface PerfDownloadButtonProps {
    series: SerieT[];
    downloadRef: RefObject<HTMLDivElement>;
}

const PerfDownloadButton = ({
    series,
    downloadRef,
}: PerfDownloadButtonProps): JSX.Element => {
    const { computePlans } = useContext(PerfBrowserContext);
    const downloadPerfCsv = useDownloadPerfCsv([series]);

    const onDownloadImage = () => {
        if (downloadRef.current) {
            toJpeg(downloadRef.current, { backgroundColor: '#fff' }).then(
                (dataUrl) => {
                    const link = document.createElement('a');
                    link.download =
                        computePlans.length === 1
                            ? `cp_${computePlans[0].key}.jpeg`
                            : 'cp_comparison.jpeg';
                    link.href = dataUrl;
                    link.click();
                }
            );
        }
    };

    return (
        <Menu>
            <MenuButton
                as={Button}
                aria-label="Download chart"
                leftIcon={<Icon as={RiDownloadLine} />}
                variant="solid"
                colorScheme="teal"
                size="sm"
            >
                Download...
            </MenuButton>
            <MenuList zIndex="popover">
                <MenuItem onClick={onDownloadImage}>Download as JPEG</MenuItem>
                {computePlans.length === 1 && (
                    <MenuItem onClick={downloadPerfCsv}>
                        Download as CSV
                    </MenuItem>
                )}
            </MenuList>
        </Menu>
    );
};

export default PerfDownloadButton;
