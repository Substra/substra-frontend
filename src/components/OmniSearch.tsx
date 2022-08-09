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
    RiGitCommitLine,
    RiSearchLine,
} from 'react-icons/ri';

import useWithAbortController from '@/hooks/useWithAbortController';
import * as AlgosApi from '@/modules/algos/AlgosApi';
import { AlgoT } from '@/modules/algos/AlgosTypes';
import { PaginatedApiResponseT } from '@/modules/common/CommonTypes';
import * as ComputePlansApi from '@/modules/computePlans/ComputePlansApi';
import { ComputePlanStubT } from '@/modules/computePlans/ComputePlansTypes';
import * as DatasetsApi from '@/modules/datasets/DatasetsApi';
import { DatasetStubT } from '@/modules/datasets/DatasetsTypes';
import * as TasksApi from '@/modules/tasks/TasksApi';
import { getTaskCategory } from '@/modules/tasks/TasksUtils';
import {
    AggregatetupleStubT,
    CompositeTraintupleStubT,
    TesttupleStubT,
    TraintupleStubT,
    PredicttupleStubT,
    TaskCategory,
    TASK_CATEGORY_SLUGS,
} from '@/modules/tasks/TuplesTypes';
import { compilePath, PATHS } from '@/paths';

const MAX_ASSETS_PER_SECTION = 5;

type OmniSearchAssetT =
    | 'algo'
    | 'compute_plan'
    | 'dataset'
    | 'traintuple'
    | 'testtuple'
    | 'predicttuple'
    | 'aggregatetuple'
    | 'composite_traintuple';

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
type WithIndexT<T extends ItemT> = T & { index: number };

const isOmniSearchAsset = (value: unknown): value is OmniSearchAssetT =>
    value === 'algo' ||
    value === 'compute_plan' ||
    value === 'dataset' ||
    value === 'traintuple' ||
    value === 'testtuple' ||
    value === 'predicttuple' ||
    value === 'aggregatetuple' ||
    value === 'composite_traintuple';

const isSeeMoreItem = (value: unknown): value is SeeMoreItemT => {
    if (value === null || typeof value !== 'object') {
        return false;
    }

    return (
        isOmniSearchAsset((value as SeeMoreItemT).asset) &&
        typeof (value as SeeMoreItemT).count === 'number'
    );
};

const isAssetItem = (value: unknown): value is AssetItemT => {
    if (value === null || typeof value !== 'object') {
        return false;
    }
    return (
        isOmniSearchAsset((value as AssetItemT).asset) &&
        typeof (value as AssetItemT).name === 'string' &&
        typeof (value as AssetItemT).key === 'string'
    );
};

type StateReducerT = UseComboboxProps<WithIndexT<ItemT>>['stateReducer'];
type OnSelectedItemChangeT = UseComboboxProps<
    WithIndexT<ItemT>
>['onSelectedItemChange'];
type GetItemProps = UseComboboxPropGetters<WithIndexT<ItemT>>['getItemProps'];

const ASSET_ITEM_ICONS: Record<OmniSearchAssetT, IconType> = {
    algo: RiCodeSSlashLine,
    compute_plan: RiGitBranchLine,
    dataset: RiDatabase2Line,
    traintuple: RiGitCommitLine,
    testtuple: RiGitCommitLine,
    predicttuple: RiGitCommitLine,
    aggregatetuple: RiGitCommitLine,
    composite_traintuple: RiGitCommitLine,
};

const AssetItem = ({
    item,
    getItemProps,
}: {
    item: WithIndexT<AssetItemT>;
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
    item: WithIndexT<SeeMoreItemT>;
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
    items: WithIndexT<ItemT>[];
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

const NoInputValue = () => (
    <ListItem textAlign="center" color="gray.500" padding="4">
        No search value
    </ListItem>
);

const buildAssetItem = (
    assetType: OmniSearchAssetT,
    asset: ComputePlanStubT | AlgoT | DatasetStubT
): AssetItemT => ({
    asset: assetType,
    name: asset.name,
    key: asset.key,
});

const buildTupleItem = (
    assetType: OmniSearchAssetT,
    asset:
        | TraintupleStubT
        | TesttupleStubT
        | PredicttupleStubT
        | AggregatetupleStubT
        | CompositeTraintupleStubT
): AssetItemT => ({
    asset: assetType,
    name: `${getTaskCategory(asset)} on ${asset.worker}`,
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
    traintuple: compilePath(PATHS.TASK, {
        category: TASK_CATEGORY_SLUGS[TaskCategory.train],
    }),
    testtuple: compilePath(PATHS.TASK, {
        category: TASK_CATEGORY_SLUGS[TaskCategory.test],
    }),
    predicttuple: compilePath(PATHS.TASK, {
        category: TASK_CATEGORY_SLUGS[TaskCategory.predict],
    }),
    aggregatetuple: compilePath(PATHS.TASK, {
        category: TASK_CATEGORY_SLUGS[TaskCategory.aggregate],
    }),
    composite_traintuple: compilePath(PATHS.TASK, {
        category: TASK_CATEGORY_SLUGS[TaskCategory.composite],
    }),
};

const SEE_MORE_ITEM_PATHS: Record<OmniSearchAssetT, string> = {
    algo: PATHS.ALGOS,
    compute_plan: PATHS.COMPUTE_PLANS,
    dataset: PATHS.DATASETS,
    traintuple: compilePath(PATHS.TASKS, {
        category: TASK_CATEGORY_SLUGS[TaskCategory.train],
    }),
    testtuple: compilePath(PATHS.TASKS, {
        category: TASK_CATEGORY_SLUGS[TaskCategory.test],
    }),
    predicttuple: compilePath(PATHS.TASKS, {
        category: TASK_CATEGORY_SLUGS[TaskCategory.predict],
    }),
    aggregatetuple: compilePath(PATHS.TASKS, {
        category: TASK_CATEGORY_SLUGS[TaskCategory.aggregate],
    }),
    composite_traintuple: compilePath(PATHS.TASKS, {
        category: TASK_CATEGORY_SLUGS[TaskCategory.composite],
    }),
};

const OmniSearch = () => {
    const [computePlans, setComputePlans] = useState<ComputePlanStubT[]>([]);
    const [computePlansCount, setComputePlansCount] = useState(0);
    const [algos, setAlgos] = useState<AlgoT[]>([]);
    const [algosCount, setAlgosCount] = useState(0);
    const [datasets, setDatasets] = useState<DatasetStubT[]>([]);
    const [datasetsCount, setDatasetsCount] = useState(0);
    const [traintuples, setTraintuples] = useState<TraintupleStubT[]>([]);
    const [traintuplesCount, setTraintuplesCount] = useState(0);
    const [testtuples, setTesttuples] = useState<TesttupleStubT[]>([]);
    const [testtuplesCount, setTesttuplesCount] = useState(0);
    const [predicttuples, setPredicttuples] = useState<PredicttupleStubT[]>([]);
    const [predicttuplesCount, setPredicttuplesCount] = useState(0);
    const [aggregatetuples, setAggregatetuples] = useState<
        AggregatetupleStubT[]
    >([]);
    const [aggregatetuplesCount, setAggregatetuplesCount] = useState(0);
    const [compositeTraintuples, setCompositeTraintuples] = useState<
        CompositeTraintupleStubT[]
    >([]);
    const [compositeTraintuplesCount, setCompositeTraintuplesCount] =
        useState(0);

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

    const items: WithIndexT<ItemT>[] = useMemo(() => {
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
            ...traintuples.map((traintuple) =>
                buildTupleItem('traintuple', traintuple)
            ),
            ...(traintuplesCount > MAX_ASSETS_PER_SECTION
                ? [buildSeeMoreItem('traintuple', traintuplesCount)]
                : []),
            ...testtuples.map((testtuple) =>
                buildTupleItem('testtuple', testtuple)
            ),
            ...(testtuplesCount > MAX_ASSETS_PER_SECTION
                ? [buildSeeMoreItem('testtuple', testtuplesCount)]
                : []),
            ...predicttuples.map((predicttuple) =>
                buildTupleItem('predicttuple', predicttuple)
            ),
            ...(predicttuplesCount > MAX_ASSETS_PER_SECTION
                ? [buildSeeMoreItem('predicttuple', predicttuplesCount)]
                : []),
            ...aggregatetuples.map((aggregatetuple) =>
                buildTupleItem('aggregatetuple', aggregatetuple)
            ),
            ...(aggregatetuplesCount > MAX_ASSETS_PER_SECTION
                ? [buildSeeMoreItem('aggregatetuple', aggregatetuplesCount)]
                : []),
            ...compositeTraintuples.map((compositeTraintuple) =>
                buildTupleItem('composite_traintuple', compositeTraintuple)
            ),
            ...(compositeTraintuplesCount > MAX_ASSETS_PER_SECTION
                ? [
                      buildSeeMoreItem(
                          'composite_traintuple',
                          compositeTraintuplesCount
                      ),
                  ]
                : []),
        ].map((item, index) => ({ ...item, index }));
    }, [
        algos,
        algosCount,
        computePlans,
        computePlansCount,
        datasets,
        datasetsCount,
        traintuples,
        traintuplesCount,
        testtuples,
        testtuplesCount,
        predicttuples,
        predicttuplesCount,
        aggregatetuples,
        aggregatetuplesCount,
        compositeTraintuples,
        compositeTraintuplesCount,
    ]);

    const algoItems = items.filter((item) => item.asset === 'algo');
    const computePlanItems = items.filter(
        (item) => item.asset === 'compute_plan'
    );
    const datasetItems = items.filter((item) => item.asset === 'dataset');
    const traintupleItems = items.filter((item) => item.asset === 'traintuple');
    const testtupleItems = items.filter((item) => item.asset === 'testtuple');
    const predicttupleItems = items.filter(
        (item) => item.asset === 'predicttuple'
    );
    const aggregatetupleItems = items.filter(
        (item) => item.asset === 'aggregatetuple'
    );
    const compositeTraintupleItems = items.filter(
        (item) => item.asset === 'composite_traintuple'
    );

    const stateReducer: StateReducerT = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (state: any, actionAndChanges: any) => {
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

    const resetAssetLists = useCallback(() => {
        setComputePlans([]);
        setComputePlansCount(0);
        setAlgos([]);
        setAlgosCount(0);
        setDatasets([]);
        setDatasetsCount(0);
        setTraintuples([]);
        setTraintuplesCount(0);
        setTesttuples([]);
        setTesttuplesCount(0);
        setPredicttuples([]);
        setPredicttuplesCount(0);
        setAggregatetuples([]);
        setAggregatetuplesCount(0);
        setCompositeTraintuples([]);
        setCompositeTraintuplesCount(0);
    }, []);

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
            resetAssetLists();

            const params = {
                page: 1,
                pageSize: MAX_ASSETS_PER_SECTION,
                match: inputValue,
            };
            const config = {
                signal: abortController.signal,
            };
            const promises: [
                AxiosPromise<PaginatedApiResponseT<ComputePlanStubT>>,
                AxiosPromise<PaginatedApiResponseT<AlgoT>>,
                AxiosPromise<PaginatedApiResponseT<DatasetStubT>>,
                AxiosPromise<PaginatedApiResponseT<TraintupleStubT>>,
                AxiosPromise<PaginatedApiResponseT<TesttupleStubT>>,
                AxiosPromise<PaginatedApiResponseT<PredicttupleStubT>>,
                AxiosPromise<PaginatedApiResponseT<AggregatetupleStubT>>,
                AxiosPromise<PaginatedApiResponseT<CompositeTraintupleStubT>>
            ] = [
                ComputePlansApi.listComputePlans(params, config),
                AlgosApi.listAlgos(params, config),
                DatasetsApi.listDatasets(params, config),
                TasksApi.listTraintuples(params, config),
                TasksApi.listTesttuples(params, config),
                TasksApi.listPredicttuples(params, config),
                TasksApi.listAggregatetuples(params, config),
                TasksApi.listCompositeTraintuples(params, config),
            ];
            try {
                const responses = await Promise.all(promises);
                const [
                    computePlansData,
                    algosData,
                    datasetsData,
                    traintuplesData,
                    testtuplesData,
                    predicttuplesData,
                    aggregatetuplesData,
                    compositeTraintuplesData,
                ] = responses.map((response) => response.data);

                setComputePlans(
                    computePlansData['results'] as ComputePlanStubT[]
                );
                setComputePlansCount(computePlansData['count']);
                setAlgos(algosData['results'] as AlgoT[]);
                setAlgosCount(algosData['count']);
                setDatasets(datasetsData['results'] as DatasetStubT[]);
                setDatasetsCount(datasetsData['count']);
                setTraintuples(traintuplesData['results'] as TraintupleStubT[]);
                setTraintuplesCount(traintuplesData['count']);
                setTesttuples(testtuplesData['results'] as TesttupleStubT[]);
                setTesttuplesCount(testtuplesData['count']);
                setPredicttuples(
                    predicttuplesData['results'] as PredicttupleStubT[]
                );
                setPredicttuplesCount(predicttuplesData['count']);
                setAggregatetuples(
                    aggregatetuplesData['results'] as AggregatetupleStubT[]
                );
                setAggregatetuplesCount(aggregatetuplesData['count']);
                setCompositeTraintuples(
                    compositeTraintuplesData[
                        'results'
                    ] as CompositeTraintupleStubT[]
                );
                setCompositeTraintuplesCount(compositeTraintuplesData['count']);
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

        if (inputValue) {
            return withAbortController(search);
        } else {
            setLoading(false);
            resetAssetLists();
        }
    }, [inputValue, withAbortController, resetAssetLists]);

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
                        {!loading && !inputValue && <NoInputValue />}
                        {!loading && inputValue && items.length === 0 && (
                            <NoResults />
                        )}
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
                            title="Train tasks"
                            items={traintupleItems}
                            getItemProps={getItemProps}
                        />
                        <ItemGroup
                            title="Test tasks"
                            items={testtupleItems}
                            getItemProps={getItemProps}
                        />
                        <ItemGroup
                            title="Predict tasks"
                            items={predicttupleItems}
                            getItemProps={getItemProps}
                        />
                        <ItemGroup
                            title="Aggregate tasks"
                            items={aggregatetupleItems}
                            getItemProps={getItemProps}
                        />
                        <ItemGroup
                            title="Composite train tasks"
                            items={compositeTraintupleItems}
                            getItemProps={getItemProps}
                        />
                    </>
                )}
            </List>
        </Box>
    );
};
export default OmniSearch;
