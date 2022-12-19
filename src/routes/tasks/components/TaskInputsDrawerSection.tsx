import React, { useEffect, useRef } from 'react';

import { HStack, Icon, Link, List, Text, Tooltip } from '@chakra-ui/react';
import {
    RiCodeLine,
    RiCodepenLine,
    RiDatabase2Line,
    RiLineChartFill,
    RiLockLine,
} from 'react-icons/ri';

import AngleIcon from '@/assets/svg/angle-icon.svg';
import useCanDownloadModel from '@/hooks/useCanDownloadModel';
import useKeyFromPath from '@/hooks/useKeyFromPath';
import { AssetKindT, AlgoInputT } from '@/modules/algos/AlgosTypes';
import { getAssetKindLabel } from '@/modules/algos/AlgosUtils';
import { FileT, PermissionsT } from '@/modules/common/CommonTypes';
import { getAllPages } from '@/modules/common/CommonUtils';
import { isDatasetStubT } from '@/modules/datasets/DatasetsUtils';
import { isModelT } from '@/modules/tasks/ModelsUtils';
import * as TasksApi from '@/modules/tasks/TasksApi';
import { TaskInputT, TaskT, TaskIOT } from '@/modules/tasks/TasksTypes';
import { compilePath, PATHS } from '@/paths';

import DownloadIconButton from '@/components/DownloadIconButton';
import {
    DrawerSection,
    DrawerSectionCollapsibleEntry,
    DrawerSectionEntry,
} from '@/components/DrawerSection';
import IconTag from '@/components/IconTag';

const makeCompactAssetKey = (key: string): string => {
    return `${key.slice(0, 5)}...${key.slice(-5)}`;
};

const inputIcon = (inputKind: AssetKindT): JSX.Element => {
    switch (inputKind) {
        case AssetKindT.dataManager:
            return (
                <IconTag
                    icon={RiCodeLine}
                    backgroundColor="gray.100"
                    fill="gray.500"
                />
            );
        case AssetKindT.dataSample:
            return (
                <IconTag
                    icon={RiDatabase2Line}
                    backgroundColor="gray.100"
                    fill="gray.500"
                />
            );
        case AssetKindT.model:
            return (
                <IconTag
                    icon={RiCodepenLine}
                    backgroundColor="gray.100"
                    fill="gray.500"
                />
            );
        case AssetKindT.performance:
            return (
                <IconTag
                    icon={RiLineChartFill}
                    backgroundColor="gray.100"
                    fill="gray.500"
                />
            );
        default:
            return <></>;
    }
};

const getInputAsset = ({
    input,
    inputsAssets,
}: {
    input: TaskInputT;
    inputsAssets: TaskIOT[];
}): TaskIOT | null => {
    if (inputsAssets.length === 0) {
        return null;
    }

    const inputAssets = inputsAssets.filter(
        (inputsAsset) => inputsAsset.identifier === input.identifier
    );

    const inputKey = input.asset_key ?? input.parent_task_key;
    for (const inputAsset of inputAssets) {
        if (
            (isDatasetStubT(inputAsset.asset) &&
                inputAsset.asset.key === inputKey) ||
            (isModelT(inputAsset.asset) &&
                inputAsset.asset.compute_task_key === inputKey)
        ) {
            return inputAsset;
        }
    }

    return null;
};

const DatasampleRepresentation = ({
    assetKey,
}: {
    assetKey?: string;
}): JSX.Element => {
    return (
        <Text as="span" fontSize="xs" lineHeight="4">
            {assetKey || 'No value available'}
        </Text>
    );
};

const OpenerRepresentation = ({
    assetKey,
    addressable,
}: {
    assetKey?: string;
    addressable?: FileT;
    permissions?: PermissionsT;
}): JSX.Element => {
    return (
        <HStack spacing="2.5" onClick={(e) => e.stopPropagation()}>
            {assetKey && (
                <Text noOfLines={1}>
                    <Link
                        href={compilePath(PATHS.DATASET, {
                            key: assetKey,
                        })}
                        color="primary.500"
                        fontWeight="semibold"
                        isExternal
                    >
                        {assetKey}
                    </Link>{' '}
                </Text>
            )}
            {addressable && (
                <DownloadIconButton
                    storageAddress={addressable.storage_address}
                    filename={`opener-${assetKey}.py`}
                    aria-label="Download opener"
                    size="xs"
                    placement="top"
                />
            )}
        </HStack>
    );
};

const ModelRepresentation = ({
    assetKey,
    addressable,
    permissions,
}: {
    assetKey?: string;
    addressable?: FileT;
    permissions?: PermissionsT;
}): JSX.Element => {
    const canDownloadModel = useCanDownloadModel();
    let content;

    if (permissions && !canDownloadModel(permissions)) {
        content = (
            <HStack spacing="1.5">
                {assetKey && (
                    <Text as="span" fontSize="xs" lineHeight="4">
                        {assetKey}
                    </Text>
                )}
                <Tooltip
                    label="Not enough permissions to see the model or missing required
                configuration on the server."
                    fontSize="xs"
                    hasArrow
                    placement="top"
                    shouldWrapChildren
                >
                    <Icon color="gray.500" as={RiLockLine} />
                </Tooltip>
            </HStack>
        );
    } else if (!addressable?.storage_address) {
        content = (
            <Text color="gray.500">Intermediary model no longer available</Text>
        );
    } else {
        content = (
            <HStack spacing="1.5">
                {assetKey && <Text>{assetKey}</Text>}
                <DownloadIconButton
                    storageAddress={addressable.storage_address}
                    filename={
                        assetKey ? `model_${assetKey}` : 'model_<unknown_key>'
                    }
                    aria-label="Download model"
                    size="xs"
                    placement="top"
                />
            </HStack>
        );
    }

    return content;
};

const TaskInputValueRepresentation = ({
    assetKind,
    input,
    inputAsset,
}: {
    assetKind: AssetKindT;
    input: TaskInputT;
    inputAsset: TaskIOT | null;
}): JSX.Element => {
    if (assetKind === AssetKindT.dataSample && !inputAsset) {
        return <DatasampleRepresentation assetKey={input.asset_key} />;
    }

    if (
        assetKind === AssetKindT.dataManager &&
        inputAsset &&
        isDatasetStubT(inputAsset.asset)
    ) {
        return (
            <OpenerRepresentation
                assetKey={input.asset_key}
                addressable={inputAsset.asset.opener}
            />
        );
    }

    if (
        assetKind === AssetKindT.model &&
        inputAsset &&
        isModelT(inputAsset.asset)
    ) {
        return (
            <ModelRepresentation
                assetKey={input.asset_key}
                addressable={inputAsset.asset.address}
                permissions={inputAsset.asset.permissions}
            />
        );
    }

    return (
        <Text noOfLines={1}>
            No representation for kind {getAssetKindLabel(assetKind)}
        </Text>
    );
};

const TaskInputRepresentation = ({
    assetKind,
    input,
    inputAsset,
}: {
    assetKind: AssetKindT;
    input: TaskInputT;
    inputAsset: TaskIOT | null;
}): JSX.Element => {
    let content;

    if (input.asset_key) {
        content = (
            <TaskInputValueRepresentation
                assetKind={assetKind}
                input={input}
                inputAsset={inputAsset}
            />
        );
    } else if (input.parent_task_key && input.parent_task_output_identifier) {
        content = (
            <HStack spacing="1.5">
                <Text noOfLines={1}>
                    From{' '}
                    <Link
                        href={compilePath(PATHS.TASK, {
                            key: input.parent_task_key,
                        })}
                        color="primary.500"
                        fontWeight="semibold"
                        isExternal
                    >
                        {makeCompactAssetKey(input.parent_task_key)}
                    </Link>
                    {''}.{input.parent_task_output_identifier}
                </Text>
                <TaskInputValueRepresentation
                    assetKind={assetKind}
                    input={input}
                    inputAsset={inputAsset}
                />
            </HStack>
        );
    } else {
        content = <p>No value found for this input</p>;
    }
    return content;
};

const TaskInputSectionEntry = ({
    identifier,
    algoInput,
    inputs,
    inputsAssets,
}: {
    identifier: string;
    algoInput: AlgoInputT;
    inputs: TaskInputT[];
    inputsAssets: TaskIOT[];
}): JSX.Element => {
    const icon = inputIcon(algoInput.kind);
    const title = identifier;

    if (algoInput.multiple || inputs.length > 1) {
        //  '|| Object.entries(inputs).length > 1' is for resilience to inconsistent data

        return (
            <DrawerSectionCollapsibleEntry
                icon={icon}
                title={title}
                titleStyle="code"
                aboveFold={
                    <Text color="gray.500">
                        {Object.keys(inputs).length}{' '}
                        {`${getAssetKindLabel(algoInput.kind)}${
                            Object.keys(inputs).length > 1 ? 's' : ''
                        }`}
                    </Text>
                }
            >
                <List spacing={2.5}>
                    {inputs.map((input, index) => (
                        <HStack spacing="2.5" key={index}>
                            <AngleIcon />
                            <TaskInputRepresentation
                                assetKind={algoInput.kind}
                                input={input}
                                inputAsset={getInputAsset({
                                    input,
                                    inputsAssets,
                                })}
                            />
                        </HStack>
                    ))}
                </List>
            </DrawerSectionCollapsibleEntry>
        );
    } else {
        return (
            <DrawerSectionEntry
                icon={icon}
                title={title}
                titleStyle="code"
                alignItems="center"
            >
                <TaskInputRepresentation
                    assetKind={algoInput.kind}
                    input={inputs[0]}
                    inputAsset={getInputAsset({
                        input: inputs[0],
                        inputsAssets,
                    })}
                />
            </DrawerSectionEntry>
        );
    }
};

const getTaskInputAssets = async (key: string): Promise<TaskIOT[]> => {
    const pageSize = 30;

    // Filtering assets to not call Datasamples as it can impact performance when there's a lot of them and doesn't contain additionnal info compared to task.inputs
    const kindFilter = Object.values(AssetKindT).filter(
        (kind) => kind !== AssetKindT.dataSample
    );

    const taskInputsAssets = await getAllPages<TaskIOT>(
        (page) =>
            TasksApi.listTaskInputAssets(
                key,
                {
                    page,
                    pageSize,
                    kind: kindFilter,
                },
                {}
            ),
        pageSize
    );

    return taskInputsAssets;
};

const TaskInputsDrawerSection = ({
    taskLoading,
    task,
}: {
    taskLoading: boolean;
    task: TaskT | null;
}): JSX.Element => {
    const key = useKeyFromPath(PATHS.TASK);
    const taskInputsAssetsRef = useRef<TaskIOT[]>();

    useEffect(() => {
        if (key) {
            getTaskInputAssets(key).then(
                (result) => (taskInputsAssetsRef.current = result)
            );
        }
    }, [key]);

    const getInputsAssets = (identifier: string): TaskIOT[] => {
        let inputAssets: TaskIOT[] = [];
        if (taskInputsAssetsRef?.current) {
            inputAssets = taskInputsAssetsRef.current.filter(
                (taskInputAsset) => taskInputAsset.identifier === identifier
            );
        }

        return inputAssets;
    };

    return (
        <DrawerSection title="Inputs">
            {task &&
                !taskLoading &&
                Object.entries(task.algo.inputs).map(
                    ([identifier, algoInput]) => {
                        const inputs = task.inputs.filter(
                            (input) => input.identifier === identifier
                        );
                        if (inputs.length > 0) {
                            return (
                                <TaskInputSectionEntry
                                    key={identifier}
                                    identifier={identifier}
                                    algoInput={algoInput}
                                    inputs={inputs}
                                    inputsAssets={getInputsAssets(identifier)}
                                />
                            );
                        }
                    }
                )}
        </DrawerSection>
    );
};

export default TaskInputsDrawerSection;
