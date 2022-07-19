import { useState } from 'react';

import { useLocation } from 'wouter';

import {
    Button,
    Flex,
    HStack,
    IconButton,
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Text,
    VStack,
} from '@chakra-ui/react';
import {
    RiCloseLine,
    RiDownloadLine,
    RiInformationLine,
    RiLineChartLine,
    RiStarLine,
} from 'react-icons/ri';

import { downloadBlob } from '@/libs/request';
import { exportPerformances } from '@/modules/computePlans/ComputePlansApi';
import { compilePath, PATHS } from '@/routes';

type BulkSelectionProps = {
    selectedComputePlans: { key: string; name: string }[];
    unselectComputePlan: (cp: { key: string; name: string }) => void;
    resetSelection: () => void;
    favorites: string[];
    setFavorites: (favorites: string[]) => void;
    isFavorite: (cpKey: string) => boolean;
};

const BulkSelection = ({
    selectedComputePlans,
    unselectComputePlan,
    resetSelection,
    favorites,
    setFavorites,
    isFavorite,
}: BulkSelectionProps): JSX.Element => {
    const [, setLocation] = useLocation();

    const selectedKeys = selectedComputePlans.map((cp) => cp.key);

    const onCompare = () => {
        setLocation(
            compilePath(PATHS.COMPARE, { keys: selectedKeys.join(',') })
        );
    };

    const onClear = () => {
        resetSelection();
    };

    const notFavorites = selectedKeys.filter((cpKey) => !isFavorite(cpKey));

    const areAllFavorites = notFavorites.length === 0;

    const onFavoriteChange = () => {
        if (areAllFavorites) {
            const newFavorites = favorites.filter(
                (fav) => !selectedKeys.includes(fav)
            );
            setFavorites(newFavorites);
        } else {
            const newFavorites = [...favorites, ...notFavorites];
            setFavorites(newFavorites);
        }
    };

    const [downloading, setDownloading] = useState(false);
    const download = async () => {
        setDownloading(true);
        const response = await exportPerformances({
            key: selectedKeys,
        });
        downloadBlob(response.data, 'performances.csv');
        setDownloading(false);
    };

    return (
        <Flex
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            color="white"
        >
            <HStack alignItems="baseline" spacing="5px" shouldWrapChildren>
                <Popover placement="top-start">
                    <PopoverTrigger>
                        <IconButton
                            icon={<RiInformationLine />}
                            aria-label="Selected compute plans list"
                            colorScheme="teal"
                        />
                    </PopoverTrigger>
                    <PopoverContent
                        width="100%"
                        boxShadow="md"
                        _focus={{ border: 'none' }}
                    >
                        <PopoverBody color="black" _focus={{ border: 'none' }}>
                            <VStack alignItems="start">
                                {selectedComputePlans.map((cp) => (
                                    <Button
                                        key={cp.key}
                                        aria-label="Unselected compute plan"
                                        variant="ghost"
                                        size="sm"
                                        leftIcon={<RiCloseLine />}
                                        whiteSpace="nowrap"
                                        onClick={() => unselectComputePlan(cp)}
                                    >
                                        {cp.name}
                                    </Button>
                                ))}
                            </VStack>
                        </PopoverBody>
                    </PopoverContent>
                </Popover>
                <Text fontSize="sm">{selectedKeys.length} selected</Text>
                <Button size="sm" onClick={onClear} colorScheme="teal">
                    Clear
                </Button>
            </HStack>
            <HStack spacing="5px">
                <Button
                    size="sm"
                    leftIcon={<RiStarLine />}
                    onClick={onFavoriteChange}
                    colorScheme="teal"
                >
                    {areAllFavorites
                        ? 'Remove from favorites'
                        : 'Add to favorites'}
                </Button>
                <Button
                    size="sm"
                    colorScheme="teal"
                    isLoading={downloading}
                    loadingText="Downloading"
                    leftIcon={<RiDownloadLine />}
                    onClick={download}
                >
                    Download
                </Button>
                <Button
                    size="sm"
                    leftIcon={<RiLineChartLine />}
                    disabled={selectedKeys.length < 2}
                    onClick={onCompare}
                    colorScheme="teal"
                >
                    Compare selection
                </Button>
            </HStack>
        </Flex>
    );
};

export default BulkSelection;
