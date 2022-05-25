import { useCallback, useEffect, useMemo, useState } from 'react';

import axios, { AxiosPromise } from 'axios';
import {
    useCombobox,
    UseComboboxPropGetters,
    UseComboboxProps,
} from 'downshift';
import { useLocation } from 'wouter';

import {
    CloseButton,
    Flex,
    HStack,
    Icon,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Text,
    Box,
    Spinner,
    List,
    ListItem,
} from '@chakra-ui/react';
import { IconType } from 'react-icons';
import {
    RiCodeSSlashLine,
    RiDatabase2Line,
    RiGitBranchLine,
    RiLineChartFill,
    RiSearchLine,
} from 'react-icons/ri';

import useWithAbortController from '@/hooks/useWithAbortController';
import * as AlgosApi from '@/modules/algos/AlgosApi';
import { AlgoT } from '@/modules/algos/AlgosTypes';
import { PaginatedApiResponse } from '@/modules/common/CommonTypes';
import * as ComputePlansApi from '@/modules/computePlans/ComputePlansApi';
import { ComputePlanStub } from '@/modules/computePlans/ComputePlansTypes';
import * as DatasetsApi from '@/modules/datasets/DatasetsApi';
import { DatasetStubType } from '@/modules/datasets/DatasetsTypes';
import * as MetricsApi from '@/modules/metrics/MetricsApi';
import { MetricType } from '@/modules/metrics/MetricsTypes';
import { compilePath, PATHS } from '@/routes';

const MAX_ASSETS_PER_SECTION = 5;

type OmniSearchAssetT = 'algo' | 'compute_plan' | 'dataset' | 'metric';
type SeeMoreItemT = {
    asset: OmniSearchAssetT;
    count: number;
};
type AssetItemT = {
    asset: OmniSearchAssetT;
    name: string;
    key: string;
};
type ItemT = AssetItemT | SeeMoreItemT;
type WithIndex<T extends ItemT> = T & { index: number };

const isOmniSearchAsset = (value: unknown): value is OmniSearchAssetT =>
    value === 'algo' ||
    value === 'compute_plan' ||
    value === 'dataset' ||
    value === 'metric';

const isSeeMoreItem = (value: unknown): value is SeeMoreItemT => {
    if (typeof value !== 'object') {
        return false;
    }

    return (
        isOmniSearchAsset((value as SeeMoreItemT).asset) &&
        typeof (value as SeeMoreItemT).count === 'number'
    );
};

const isAssetItem = (value: unknown): value is AssetItemT => {
    if (typeof value !== 'object') {
        return false;
    }
    return (
        isOmniSearchAsset((value as AssetItemT).asset) &&
        typeof (value as AssetItemT).name === 'string' &&
        typeof (value as AssetItemT).key === 'string'
    );
};

type StateReducerT = UseComboboxProps<WithIndex<ItemT>>['stateReducer'];
type OnSelectedItemChangeT = UseComboboxProps<
    WithIndex<ItemT>
>['onSelectedItemChange'];
type GetItemProps = UseComboboxPropGetters<WithIndex<ItemT>>['getItemProps'];

const ASSET_ITEM_ICONS: Record<OmniSearchAssetT, IconType> = {
    algo: RiCodeSSlashLine,
    compute_plan: RiGitBranchLine,
    dataset: RiDatabase2Line,
    metric: RiLineChartFill,
};

const AssetItem = ({
    item,
    getItemProps,
}: {
    item: WithIndex<AssetItemT>;
    getItemProps: GetItemProps;
}) => {
    const itemProps = getItemProps({ item, index: item.index });
    const selected = itemProps['aria-selected'] === 'true';
    return (
        <ListItem
            padding="4"
            backgroundColor={selected ? 'gray.100' : 'white'}
            cursor="pointer"
            {...itemProps}
        >
            <HStack spacing="4" alignItems="center">
                <Flex
                    width="28px"
                    height="28px"
                    borderRadius="14px"
                    backgroundColor="teal.100"
                    color="teal.500"
                    fontSize="xs"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Icon as={ASSET_ITEM_ICONS[item.asset]} />
                </Flex>
                <Box>
                    <Text color="gray.800" maxWidth="265px" noOfLines={1}>
                        {item.name}
                    </Text>
                    <Text color="gray.500">{item.key}</Text>
                </Box>
            </HStack>
        </ListItem>
    );
};

const SeeMoreItem = ({
    item,
    getItemProps,
}: {
    item: WithIndex<SeeMoreItemT>;
    getItemProps: GetItemProps;
}) => {
    const itemProps = getItemProps({ item, index: item.index });
    const selected = itemProps['aria-selected'] === 'true';
    return (
        <ListItem
            textAlign="center"
            color="teal.500"
            padding="4"
            cursor="pointer"
            textDecoration={selected ? 'underline' : ''}
            {...itemProps}
        >
            {`See ${item.count} more`}
        </ListItem>
    );
};

const ItemGroup = ({
    title,
    items,
    getItemProps,
}: {
    title: string;
    items: WithIndex<ItemT>[];
    getItemProps: GetItemProps;
}) => {
    if (!items.length) {
        return null;
    }

    return (
        <ListItem>
            <List>
                <ListItem
                    padding="4"
                    textTransform="uppercase"
                    fontWeight="bold"
                    color="gray.600"
                >
                    {title}
                </ListItem>
                {items.map((item) => {
                    if (isAssetItem(item)) {
                        return (
                            <AssetItem
                                key={item.key}
                                item={item}
                                getItemProps={getItemProps}
                            />
                        );
                    }
                    if (isSeeMoreItem(item)) {
                        return (
                            <SeeMoreItem
                                key={item.asset}
                                item={item}
                                getItemProps={getItemProps}
                            />
                        );
                    }
                    return null;
                })}
            </List>
        </ListItem>
    );
};

const Loading = () => (
    <ListItem
        as={HStack}
        spacing="2"
        alignItems="center"
        justifyContent="center"
        padding="4"
    >
        <Spinner />
        <Text>Loading</Text>
    </ListItem>
);

const NoResults = () => (
    <ListItem textAlign="center" color="gray.500" padding="4">
        No matching result
    </ListItem>
);

const buildAssetItem = (
    assetType: OmniSearchAssetT,
    asset: ComputePlanStub | AlgoT | DatasetStubType | MetricType
): AssetItemT => ({
    asset: assetType,
    name: asset.name,
    key: asset.key,
});

const buildSeeMoreItem = (
    assetType: OmniSearchAssetT,
    count: number
): SeeMoreItemT => ({
    asset: assetType,
    count,
});

const ASSET_ITEM_PATHS: Record<OmniSearchAssetT, string> = {
    algo: PATHS.ALGO,
    compute_plan: PATHS.COMPUTE_PLAN,
    dataset: PATHS.DATASET,
    metric: PATHS.METRIC,
};

const SEE_MORE_ITEM_PATHS: Record<OmniSearchAssetT, string> = {
    algo: PATHS.ALGOS,
    compute_plan: PATHS.COMPUTE_PLANS,
    dataset: PATHS.DATASETS,
    metric: PATHS.METRICS,
};

const OmniSearch = () => {
    const [computePlans, setComputePlans] = useState<ComputePlanStub[]>([]);
    const [computePlansCount, setComputePlansCount] = useState(0);
    const [algos, setAlgos] = useState<AlgoT[]>([]);
    const [algosCount, setAlgosCount] = useState(0);
    const [datasets, setDatasets] = useState<DatasetStubType[]>([]);
    const [datasetsCount, setDatasetsCount] = useState(0);
    const [metrics, setMetrics] = useState<MetricType[]>([]);
    const [metricsCount, setMetricsCount] = useState(0);

    const [loading, setLoading] = useState(false);

    const [, setLocation] = useLocation();

    const goToAsset = ({ asset, key }: AssetItemT) => {
        const path = compilePath(ASSET_ITEM_PATHS[asset], { key });
        setLocation(path);
    };

    const goToAssets = (
        { asset }: SeeMoreItemT,
        inputValue: string | undefined
    ) => {
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.set('page', '1');
        if (inputValue) {
            urlSearchParams.set('match', inputValue);
        }
        const path = SEE_MORE_ITEM_PATHS[asset];
        const url = `${path}?${urlSearchParams.toString()}`;
        setLocation(url);
    };

    const items: WithIndex<ItemT>[] = useMemo(() => {
        return [
            ...computePlans.map((cp) => buildAssetItem('compute_plan', cp)),
            ...(computePlansCount > MAX_ASSETS_PER_SECTION
                ? [buildSeeMoreItem('compute_plan', computePlansCount)]
                : []),
            ...algos.map((algo) => buildAssetItem('algo', algo)),
            ...(algosCount > MAX_ASSETS_PER_SECTION
                ? [buildSeeMoreItem('algo', algosCount)]
                : []),
            ...datasets.map((dataset) => buildAssetItem('dataset', dataset)),
            ...(datasetsCount > MAX_ASSETS_PER_SECTION
                ? [buildSeeMoreItem('dataset', datasetsCount)]
                : []),
            ...metrics.map((metric) => buildAssetItem('metric', metric)),
            ...(metricsCount > MAX_ASSETS_PER_SECTION
                ? [buildSeeMoreItem('metric', metricsCount)]
                : []),
        ].map((item, index) => ({ ...item, index }));
    }, [
        algos,
        algosCount,
        computePlans,
        computePlansCount,
        datasets,
        datasetsCount,
        metrics,
        metricsCount,
    ]);

    const algoItems = items.filter((item) => item.asset === 'algo');
    const computePlanItems = items.filter(
        (item) => item.asset === 'compute_plan'
    );
    const datasetItems = items.filter((item) => item.asset === 'dataset');
    const metricItems = items.filter((item) => item.asset === 'metric');

    const stateReducer: StateReducerT = useCallback(
        (state, actionAndChanges) => {
            const { type, changes } = actionAndChanges;
            switch (type) {
                case useCombobox.stateChangeTypes.ItemClick:
                case useCombobox.stateChangeTypes.InputKeyDownEnter:
                case useCombobox.stateChangeTypes.InputBlur:
                    if (changes.selectedItem) {
                        return {
                            ...changes,
                            inputValue: '',
                            previousInputValue: state.inputValue,
                        };
                    }
                    return changes;
                default:
                    return changes;
            }
        },
        []
    );

    const onSelectedItemChange: OnSelectedItemChangeT = (changes) => {
        const { selectedItem } = changes;
        if (isAssetItem(selectedItem)) {
            goToAsset(selectedItem);
        }
        if (isSeeMoreItem(selectedItem)) {
            // @ts-expect-error: previousInputValue is a custom value injected by our state reducer than therefore isn't reflected in the downshift type
            const { previousInputValue } = changes;
            goToAssets(selectedItem, previousInputValue);
        }
    };

    const {
        isOpen,
        getMenuProps,
        getInputProps,
        getComboboxProps,
        getItemProps,
        // advanced props
        inputValue,
        reset,
    } = useCombobox({
        items,
        stateReducer,
        onSelectedItemChange,
    });

    const withAbortController = useWithAbortController();

    useEffect(() => {
        const search = async (abortController: AbortController) => {
            setLoading(true);

            setComputePlans([]);
            setComputePlansCount(0);
            setAlgos([]);
            setAlgosCount(0);
            setDatasets([]);
            setDatasetsCount(0);
            setMetrics([]);
            setMetricsCount(0);

            const params = {
                page: 1,
                pageSize: MAX_ASSETS_PER_SECTION,
                match: inputValue,
            };
            const config = {
                signal: abortController.signal,
            };
            const promises: [
                AxiosPromise<PaginatedApiResponse<ComputePlanStub>>,
                AxiosPromise<PaginatedApiResponse<AlgoT>>,
                AxiosPromise<PaginatedApiResponse<DatasetStubType>>,
                AxiosPromise<PaginatedApiResponse<MetricType>>
            ] = [
                ComputePlansApi.listComputePlans(params, config),
                AlgosApi.listAlgos(params, config),
                DatasetsApi.listDatasets(params, config),
                MetricsApi.listMetrics(params, config),
            ];
            try {
                const responses = await Promise.all(promises);
                const [computePlansData, algosData, datasetsData, metricsData] =
                    responses.map((response) => response.data);

                setComputePlans(
                    computePlansData['results'] as ComputePlanStub[]
                );
                setComputePlansCount(computePlansData['count']);
                setAlgos(algosData['results'] as AlgoT[]);
                setAlgosCount(algosData['count']);
                setDatasets(datasetsData['results'] as DatasetStubType[]);
                setDatasetsCount(datasetsData['count']);
                setMetrics(metricsData['results'] as MetricType[]);
                setMetricsCount(metricsData['count']);
                setLoading(false);
            } catch (error) {
                if (
                    !axios.isAxiosError(error) ||
                    error.message !== 'canceled'
                ) {
                    setLoading(false);
                }
            }
        };
        return withAbortController(search);
    }, [inputValue, withAbortController]);

    return (
        <Box position="relative" width="360px">
            <InputGroup size="sm" {...getComboboxProps()}>
                <InputLeftElement
                    pointerEvents="none"
                    children={
                        <RiSearchLine fill="var(--chakra-colors-gray-400)" />
                    }
                />
                <Input
                    placeholder="Search name or key..."
                    variant="outline"
                    colorScheme="gray"
                    borderRadius="36px"
                    borderColor="gray.100"
                    backgroundColor="gray.100"
                    _focus={{
                        backgroundColor: 'white',
                        borderColor: 'teal.500',
                    }}
                    {...getInputProps()}
                />
                <InputRightElement>
                    {inputValue && <CloseButton size="sm" onClick={reset} />}
                </InputRightElement>
            </InputGroup>
            <List
                {...getMenuProps()}
                position="absolute"
                top="calc(100% + 8px)"
                left="0"
                right="0"
                maxHeight={isOpen ? '600px' : '0'}
                overflowY="auto"
                zIndex="popover"
                backgroundColor="white"
                border={isOpen ? '1px solid' : 'none'}
                borderColor={isOpen ? 'gray.100' : 'transparent'}
                boxShadow={isOpen ? 'md' : undefined}
                fontSize="xs"
            >
                {isOpen && (
                    <>
                        {loading && <Loading />}
                        {!loading && items.length === 0 && <NoResults />}
                        <ItemGroup
                            title="Compute plans"
                            items={computePlanItems}
                            getItemProps={getItemProps}
                        />
                        <ItemGroup
                            title="Algorithms"
                            items={algoItems}
                            getItemProps={getItemProps}
                        />
                        <ItemGroup
                            title="Datasets"
                            items={datasetItems}
                            getItemProps={getItemProps}
                        />
                        <ItemGroup
                            title="Metrics"
                            items={metricItems}
                            getItemProps={getItemProps}
                        />
                    </>
                )}
            </List>
        </Box>
    );
};
export default OmniSearch;
