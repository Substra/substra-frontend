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

import * as ComputePlansApi from '@/api/ComputePlansApi';
import * as DatasetsApi from '@/api/DatasetsApi';
import * as FunctionsApi from '@/api/FunctionsApi';
import * as TasksApi from '@/api/TasksApi';
import useWithAbortController from '@/hooks/useWithAbortController';
import { compilePath, PATHS } from '@/paths';
import { PaginatedApiResponseT } from '@/types/CommonTypes';
import { ComputePlanStubT } from '@/types/ComputePlansTypes';
import { DatasetStubT } from '@/types/DatasetTypes';
import { FunctionT } from '@/types/FunctionsTypes';
import { TaskT } from '@/types/TasksTypes';

const MAX_ASSETS_PER_SECTION = 5;

type OmniSearchAssetT = 'function' | 'compute_plan' | 'dataset' | 'task';

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
    value === 'function' ||
    value === 'compute_plan' ||
    value === 'dataset' ||
    value === 'task';

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
    function: RiCodeSSlashLine,
    compute_plan: RiGitBranchLine,
    dataset: RiDatabase2Line,
    task: RiGitCommitLine,
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
                    backgroundColor="primary.100"
                    color="primary.500"
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
            color="primary.500"
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
    asset: ComputePlanStubT | FunctionT | DatasetStubT
): AssetItemT => ({
    asset: assetType,
    name: asset.name,
    key: asset.key,
});

const buildTaskItem = (
    assetType: OmniSearchAssetT,
    asset: TaskT
): AssetItemT => ({
    asset: assetType,
    name: `Task on ${asset.worker}`,
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
    function: PATHS.FUNCTION,
    compute_plan: PATHS.COMPUTE_PLAN,
    dataset: PATHS.DATASET,
    task: PATHS.TASK,
};

const SEE_MORE_ITEM_PATHS: Record<OmniSearchAssetT, string> = {
    function: PATHS.FUNCTIONS,
    compute_plan: PATHS.COMPUTE_PLANS,
    dataset: PATHS.DATASETS,
    task: PATHS.TASKS,
};

const OmniSearch = () => {
    const [computePlans, setComputePlans] = useState<ComputePlanStubT[]>([]);
    const [computePlansCount, setComputePlansCount] = useState(0);
    const [functions, setFunctions] = useState<FunctionT[]>([]);
    const [functionsCount, setFunctionsCount] = useState(0);
    const [datasets, setDatasets] = useState<DatasetStubT[]>([]);
    const [datasetsCount, setDatasetsCount] = useState(0);
    const [tasks, setTasks] = useState<TaskT[]>([]);
    const [tasksCount, setTasksCount] = useState(0);

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
            ...functions.map((func) => buildAssetItem('function', func)),
            ...(functionsCount > MAX_ASSETS_PER_SECTION
                ? [buildSeeMoreItem('function', functionsCount)]
                : []),
            ...datasets.map((dataset) => buildAssetItem('dataset', dataset)),
            ...(datasetsCount > MAX_ASSETS_PER_SECTION
                ? [buildSeeMoreItem('dataset', datasetsCount)]
                : []),
            ...tasks.map((task) => buildTaskItem('task', task)),
            ...(tasksCount > MAX_ASSETS_PER_SECTION
                ? [buildSeeMoreItem('task', tasksCount)]
                : []),
        ].map((item, index) => ({ ...item, index }));
    }, [
        functions,
        functionsCount,
        computePlans,
        computePlansCount,
        datasets,
        datasetsCount,
        tasks,
        tasksCount,
    ]);

    const functionItems = items.filter((item) => item.asset === 'function');
    const computePlanItems = items.filter(
        (item) => item.asset === 'compute_plan'
    );
    const datasetItems = items.filter((item) => item.asset === 'dataset');
    const taskItems = items.filter((item) => item.asset === 'task');

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
        setFunctions([]);
        setFunctionsCount(0);
        setDatasets([]);
        setDatasetsCount(0);
        setTasks([]);
        setTasksCount(0);
    }, []);

    const {
        isOpen,
        getMenuProps,
        getInputProps,
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
                AxiosPromise<PaginatedApiResponseT<FunctionT>>,
                AxiosPromise<PaginatedApiResponseT<DatasetStubT>>,
                AxiosPromise<PaginatedApiResponseT<TaskT>>
            ] = [
                ComputePlansApi.listComputePlans(params, config),
                FunctionsApi.listFunctions(params, config),
                DatasetsApi.listDatasets(params, config),
                TasksApi.listTasks(params, config),
            ];
            try {
                const responses = await Promise.all(promises);
                const [
                    computePlansData,
                    functionsData,
                    datasetsData,
                    tasksData,
                ] = responses.map((response) => response.data);

                setComputePlans(
                    computePlansData['results'] as ComputePlanStubT[]
                );
                setComputePlansCount(computePlansData['count']);
                setFunctions(functionsData['results'] as FunctionT[]);
                setFunctionsCount(functionsData['count']);
                setDatasets(datasetsData['results'] as DatasetStubT[]);
                setDatasetsCount(datasetsData['count']);
                setTasks(tasksData['results'] as TaskT[]);
                setTasksCount(tasksData['count']);
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
            <InputGroup size="sm">
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
                        borderColor: 'primary.500',
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
                            title="Functions"
                            items={functionItems}
                            getItemProps={getItemProps}
                        />
                        <ItemGroup
                            title="Datasets"
                            items={datasetItems}
                            getItemProps={getItemProps}
                        />
                        <ItemGroup
                            title="Tasks"
                            items={taskItems}
                            getItemProps={getItemProps}
                        />
                    </>
                )}
            </List>
        </Box>
    );
};
export default OmniSearch;
