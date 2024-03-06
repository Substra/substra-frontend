import { useContext, useState } from 'react';

import { toJpeg } from 'html-to-image';

import {
    Button,
    Icon,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
} from '@chakra-ui/react';
import { RiArrowDownSLine, RiDownloadLine } from 'react-icons/ri';

import { exportPerformances } from '@/api/ComputePlansApi';
import { downloadBlob } from '@/api/request';
import useMetadataStore from '@/features/metadata/useMetadataStore';
import { PerfBrowserContext } from '@/features/perfBrowser/usePerfBrowser';
import { APIListArgsT } from '@/types/CommonTypes';

const PerfDownloadButton = (): JSX.Element => {
    const { computePlans, loading, perfChartRef, selectedIdentifier } =
        useContext(PerfBrowserContext);

    const { metadata } = useMetadataStore();

    const [downloading, setDownloading] = useState(false);
    const download = async () => {
        setDownloading(true);
        let payload: APIListArgsT = {
            key: computePlans.map((cp) => cp.key),
            metadata_columns: metadata.join(),
        };

        if (selectedIdentifier) {
            payload = {
                ...payload,
                identifier: selectedIdentifier,
            };
        }
        const response = await exportPerformances(payload);

        const downloadName =
            computePlans.length > 1
                ? 'selected_performances.csv'
                : `${computePlans[0].key}.csv`;
        downloadBlob(response.data, downloadName);
        setDownloading(false);
    };

    const onDownloadImage = () => {
        if (perfChartRef?.current) {
            toJpeg(perfChartRef?.current, { backgroundColor: '#fff' }).then(
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

    if (!selectedIdentifier) {
        return (
            <Button
                aria-label="Download chart"
                leftIcon={<Icon as={RiDownloadLine} />}
                variant="outline"
                colorScheme="primary"
                size="xs"
                isDisabled={loading}
                isLoading={downloading}
                onClick={download}
            >
                Download as CSV
            </Button>
        );
    }

    return (
        <Menu>
            <MenuButton
                as={Button}
                aria-label="Download chart"
                leftIcon={<Icon as={RiDownloadLine} />}
                rightIcon={<Icon as={RiArrowDownSLine} />}
                variant="outline"
                colorScheme="primary"
                size="xs"
                isDisabled={loading}
                isLoading={downloading}
                data-cy="download-button"
            >
                Download
            </MenuButton>
            <MenuList zIndex="popover">
                <MenuItem
                    onClick={onDownloadImage}
                    fontSize="xs"
                    data-cy="download-as-jpeg"
                >
                    Download as JPEG
                </MenuItem>
                <MenuItem
                    onClick={download}
                    fontSize="xs"
                    data-cy="download-as-csv"
                >
                    Download as CSV
                </MenuItem>
            </MenuList>
        </Menu>
    );
};

export default PerfDownloadButton;
