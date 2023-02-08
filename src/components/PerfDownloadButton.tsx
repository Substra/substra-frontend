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

import useAppSelector from '@/hooks/useAppSelector';
import { PerfBrowserContext } from '@/hooks/usePerfBrowser';
import { useSyncedStringState } from '@/hooks/useSyncedState';
import { downloadBlob } from '@/libs/request';
import { exportPerformances } from '@/modules/computePlans/ComputePlansApi';

const PerfDownloadButton = (): JSX.Element => {
    const { computePlans, loading, selectedMetricName, perfChartRef } =
        useContext(PerfBrowserContext);

    const metadata = useAppSelector((state) => state.metadata.metadata);
    const [selectedMetricKey] = useSyncedStringState('selectedMetricKey', '');
    const [selectedMetricOutputIdentifier] = useSyncedStringState(
        'selectedMetricOutputIdentifier',
        ''
    );

    const [downloading, setDownloading] = useState(false);
    const download = async () => {
        setDownloading(true);
        let response;

        if (selectedMetricKey && selectedMetricOutputIdentifier) {
            response = await exportPerformances({
                key: computePlans.map((cp) => cp.key),
                metadata: metadata.join(),
                metric_key: selectedMetricKey,
                metric_output_identifier: selectedMetricOutputIdentifier,
            });
        } else {
            response = await exportPerformances({
                key: computePlans.map((cp) => cp.key),
                metadata: metadata.join(),
            });
        }
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

    if (!selectedMetricName) {
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
            >
                Download
            </MenuButton>
            <MenuList zIndex="popover">
                <MenuItem onClick={onDownloadImage} fontSize="xs">
                    Download as JPEG
                </MenuItem>
                <MenuItem onClick={download} fontSize="xs">
                    Download as CSV
                </MenuItem>
            </MenuList>
        </Menu>
    );
};

export default PerfDownloadButton;
