import { useContext, useMemo } from 'react';

import {
    Checkbox,
    Flex,
    Icon,
    List,
    ListItem,
    Skeleton,
    Text,
    useDisclosure,
    Collapse,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Link,
    useClipboard,
    Box,
} from '@chakra-ui/react';
import { RiArrowDropDownLine, RiMore2Fill } from 'react-icons/ri';

import {
    OrganizationListItem,
    PerfSidebarContainer,
    SerieListItem,
} from '@/features/perfBrowser/PerfSidebarCommon';
import { PerfBrowserContext } from '@/features/perfBrowser/usePerfBrowser';
import usePerfBrowserColors from '@/features/perfBrowser/usePerfBrowserColors';
import useFavoriteComputePlans from '@/hooks/useFavoriteComputePlans';
import { useToast } from '@/hooks/useToast';
import { compilePath, PATHS } from '@/paths';

const LoadingState = (): JSX.Element => {
    return (
        <List spacing="2.5">
            <ListItem>
                <Skeleton width="100px" height="16px" />
                <List paddingLeft="6" spacing="2.5" marginTop="2.5">
                    <ListItem>
                        <Skeleton width="200px" height="16px" />
                    </ListItem>
                    <ListItem>
                        <Skeleton width="200px" height="16px" />
                    </ListItem>
                    <ListItem>
                        <Skeleton width="200px" height="16px" />
                    </ListItem>
                </List>
            </ListItem>
            <ListItem>
                <Skeleton width="100px" height="16px" />
                <List paddingLeft="6" spacing="2.5" marginTop="2.5">
                    <ListItem>
                        <Skeleton width="200px" height="16px" />
                    </ListItem>
                    <ListItem>
                        <Skeleton width="200px" height="16px" />
                    </ListItem>
                </List>
            </ListItem>
        </List>
    );
};

const hierarchyBackgrounds = ({
    vlBottom,
    hlTop,
    hlSpacing,
}: {
    vlBottom: number;
    hlTop: number;
    hlSpacing: number;
}) => ({
    backgroundImage:
        'linear-gradient(var(--chakra-colors-gray-300), var(--chakra-colors-gray-300)), ' +
        `repeating-linear-gradient(transparent 0, transparent ${hlTop}px, var(--chakra-colors-gray-300) ${hlTop}px, var(--chakra-colors-gray-300) ${
            hlTop + 1
        }px, transparent ${hlTop + 1}px, transparent ${hlSpacing}px);`,

    backgroundSize: `1px calc(100% - ${vlBottom}px), 10px 100%`,
    backgroundPosition: '7px 0, 7px 0',
    backgroundRepeat: 'no-repeat, repeat-y',
});

const ComputePlanCheckbox = ({
    computePlanKey,
    isOpen,
    onToggle,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
}: {
    computePlanKey: string;
    isOpen: boolean;
    onToggle: () => void;
    isFavorite: (cpkey: string) => boolean;
    addToFavorites: (favorite: string) => void;
    removeFromFavorites: (favorite: string) => void;
}): JSX.Element => {
    const {
        computePlans,
        onComputePlanKeySelectionChange,
        selectedComputePlanKeys,
        getComputePlanIndex,
        setHighlightedComputePlanKey,
    } = useContext(PerfBrowserContext);
    const { getColorScheme } = usePerfBrowserColors();

    const computePlan = computePlans.find((cp) => cp.key === computePlanKey);

    const { onCopy } = useClipboard(computePlanKey);
    const toast = useToast();

    const onClickCopy = () => {
        onCopy();
        toast({
            title: 'Copied in clipboard',
            status: 'success',
            isClosable: true,
        });
    };

    const toggleFavorite = () => {
        if (!computePlan) {
            return;
        }

        if (isFavorite(computePlan.key)) {
            removeFromFavorites(computePlan.key);
            toast({
                title: 'Removed from favorites',
                status: 'success',
                isClosable: true,
            });
        } else {
            addToFavorites(computePlan.key);
            toast({
                title: 'Added to favorites',
                status: 'success',
                isClosable: true,
            });
        }
    };

    return (
        <Flex
            alignItems="flex-start"
            justifyContent="space-between"
            onMouseEnter={() => setHighlightedComputePlanKey(computePlanKey)}
            onMouseLeave={() => setHighlightedComputePlanKey(undefined)}
        >
            <Checkbox
                colorScheme={getColorScheme({ computePlanKey, worker: '' })}
                onChange={onComputePlanKeySelectionChange(computePlanKey)}
                isChecked={selectedComputePlanKeys.includes(computePlanKey)}
                alignItems="baseline"
                maxWidth="235px"
            >
                <Text as="span" fontSize="xs" fontWeight="semibold">
                    {`#${getComputePlanIndex(computePlanKey)}`}
                </Text>
                {computePlan && (
                    <>
                        <Text as="span" fontSize="xs" marginX="1">
                            •
                        </Text>
                        <Text as="span" fontSize="xs">
                            {computePlan.name}
                        </Text>
                    </>
                )}
            </Checkbox>
            <Box>
                {computePlan && (
                    <Menu>
                        <MenuButton
                            as={IconButton}
                            aria-label="More actions"
                            icon={
                                <Icon
                                    as={RiMore2Fill}
                                    width="14px"
                                    height="14px"
                                />
                            }
                            variant="ghost"
                            size="xs"
                        />
                        <MenuList zIndex="popover">
                            <Link
                                href={compilePath(PATHS.COMPUTE_PLAN_TASKS, {
                                    key: computePlanKey,
                                })}
                                isExternal
                                _hover={{ textDecoration: 'none' }}
                            >
                                <MenuItem
                                    _hover={{
                                        textDecoration: 'none',
                                    }}
                                >
                                    Go to compute plan
                                </MenuItem>
                            </Link>
                            <MenuItem onClick={toggleFavorite}>
                                {isFavorite(computePlan.key)
                                    ? 'Remove from favorites'
                                    : 'Add to favorites'}
                            </MenuItem>
                            <MenuItem onClick={onClickCopy}>Copy key</MenuItem>
                        </MenuList>
                    </Menu>
                )}

                <IconButton
                    icon={
                        <Icon
                            as={RiArrowDropDownLine}
                            width="24px"
                            height="24px"
                            transform={isOpen ? '' : 'rotate(-90deg)'}
                        />
                    }
                    aria-label={isOpen ? 'Display lines' : 'Hide lines'}
                    onClick={onToggle}
                    variant="ghost"
                    size="xs"
                />
            </Box>
        </Flex>
    );
};

const SerieList = ({
    computePlanKey,
}: {
    computePlanKey: string;
}): JSX.Element => {
    const { rankData: allRankData, isOrganizationIdSelected } =
        useContext(PerfBrowserContext);

    const rankData = useMemo(
        () =>
            allRankData.filter(
                (serieRankData) =>
                    serieRankData.computePlanKey === computePlanKey &&
                    isOrganizationIdSelected(serieRankData.worker)
            ),
        [allRankData, isOrganizationIdSelected, computePlanKey]
    );

    return (
        <List
            marginTop="2.5"
            {...hierarchyBackgrounds({
                vlBottom: 20,
                hlTop: 20,
                hlSpacing: 40,
            })}
            marginRight="-20px"
        >
            {rankData.map((serieRankData) => (
                <SerieListItem
                    serieRankData={serieRankData}
                    key={`${computePlanKey}-${serieRankData.id}`}
                />
            ))}
        </List>
    );
};

const OrganizationList = ({
    computePlanKey,
}: {
    computePlanKey: string;
}): JSX.Element => {
    const {
        organizations: allOrganizations,
        isOrganizationIdSelected,
        series,
    } = useContext(PerfBrowserContext);

    const organizations = useMemo(
        () =>
            allOrganizations.filter(
                (organization) =>
                    isOrganizationIdSelected(organization.id) &&
                    !!series.find(
                        (serie) =>
                            serie.worker === organization.id &&
                            serie.computePlanKey === computePlanKey
                    )
            ),
        [allOrganizations, computePlanKey, isOrganizationIdSelected, series]
    );

    return (
        <List
            paddingLeft="5"
            marginTop="2.5"
            {...hierarchyBackgrounds({
                vlBottom: 20,
                hlTop: 20,
                hlSpacing: 40,
            })}
        >
            {organizations.map((organization) => (
                <OrganizationListItem
                    key={organization.id}
                    organizationId={organization.id}
                    computePlanKey={computePlanKey}
                />
            ))}
        </List>
    );
};

type ComputePlanSectionProps = {
    computePlanKey: string;
    isFavorite: (cpkey: string) => boolean;
    addToFavorites: (favorite: string) => void;
    removeFromFavorites: (favorite: string) => void;
};
const ComputePlanSection = ({
    computePlanKey,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
}: ComputePlanSectionProps): JSX.Element => {
    const { selectedMetricName } = useContext(PerfBrowserContext);
    const { isOpen, onToggle } = useDisclosure({
        defaultIsOpen: true,
    });

    return (
        <ListItem key={computePlanKey}>
            <ComputePlanCheckbox
                computePlanKey={computePlanKey}
                isOpen={isOpen}
                onToggle={onToggle}
                isFavorite={isFavorite}
                addToFavorites={addToFavorites}
                removeFromFavorites={removeFromFavorites}
            />
            <Collapse in={isOpen} animateOpacity>
                {selectedMetricName ? (
                    <SerieList computePlanKey={computePlanKey} />
                ) : (
                    <OrganizationList computePlanKey={computePlanKey} />
                )}
            </Collapse>
        </ListItem>
    );
};

const PerfSidebarComputePlans = (): JSX.Element => {
    const { loading, computePlans } = useContext(PerfBrowserContext);

    const { isFavorite, addToFavorites, removeFromFavorites } =
        useFavoriteComputePlans();

    if (loading) {
        return (
            <PerfSidebarContainer title="Compute plans">
                <LoadingState />
            </PerfSidebarContainer>
        );
    }

    return (
        <PerfSidebarContainer title="Compute plans">
            <List spacing="6">
                {computePlans.map((computePlan) => (
                    <ComputePlanSection
                        computePlanKey={computePlan.key}
                        key={computePlan.key}
                        isFavorite={isFavorite}
                        addToFavorites={addToFavorites}
                        removeFromFavorites={removeFromFavorites}
                    />
                ))}
            </List>
        </PerfSidebarContainer>
    );
};

export default PerfSidebarComputePlans;
