import { useContext } from 'react';

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

import useDownloadPerfCsv from '@/hooks/useDownloadPerfCsv';
import { PerfBrowserContext } from '@/hooks/usePerfBrowser';

const PerfDownloadButton = (): JSX.Element => {
    const {
        computePlans,
        loading,
        selectedMetricName,
        selectedSeriesGroup,
        seriesGroups,
        perfChartRef,
    } = useContext(PerfBrowserContext);
    const downloadPerfCsv = useDownloadPerfCsv(
        selectedMetricName ? [selectedSeriesGroup] : seriesGroups
    );

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
                colorScheme="teal"
                size="xs"
                isDisabled={loading}
                onClick={downloadPerfCsv}
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
                colorScheme="teal"
                size="xs"
                isDisabled={loading}
            >
                Download
            </MenuButton>
            <MenuList zIndex="popover">
                <MenuItem onClick={onDownloadImage} fontSize="xs">
                    Download as JPEG
                </MenuItem>
                <MenuItem onClick={downloadPerfCsv} fontSize="xs">
                    Download as CSV
                </MenuItem>
            </MenuList>
        </Menu>
    );
};

export default PerfDownloadButton;
