import React, { useCallback, useEffect } from 'react';

import { HStack, Icon, Link, List, Text, Tooltip } from '@chakra-ui/react';
import {
    RiCodeLine,
    RiCodepenLine,
    RiDatabase2Line,
    RiLineChartFill,
    RiLockLine,
} from 'react-icons/ri';

import AngleIcon from '@/assets/svg/angle-icon.svg';
import useAppSelector from '@/hooks/useAppSelector';
import useCanDownloadModel from '@/hooks/useCanDownloadModel';
import useDispatchWithAutoAbort from '@/hooks/useDispatchWithAutoAbort';
import { AssetKindT, InputT } from '@/modules/algos/AlgosTypes';
import { getAssetKindLabel } from '@/modules/algos/AlgosUtils';
import { FileT, PermissionsT } from '@/modules/common/CommonTypes';
import { isDatasetStubT } from '@/modules/datasets/DatasetsUtils';
import { isModelT } from '@/modules/tasks/ModelsUtils';
import { listTaskInputAssets } from '@/modules/tasks/TasksSlice';
import { TaskInputT, TaskT, TaskIOAssetT } from '@/modules/tasks/TasksTypes';
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
}: {
    assetKind: AssetKindT;
    input: {
        specs: TaskInputT;
        asset?: TaskIOAssetT;
    };
}): JSX.Element => {
    if (assetKind === AssetKindT.dataSample && !input.asset) {
        return <DatasampleRepresentation assetKey={input.specs.asset_key} />;
    }

    if (assetKind === AssetKindT.dataManager && isDatasetStubT(input.asset)) {
        return (
            <OpenerRepresentation
                assetKey={input.specs.asset_key}
                addressable={input.asset.opener}
            />
        );
    }

    if (assetKind === AssetKindT.model && isModelT(input.asset)) {
        return (
            <ModelRepresentation
                assetKey={input.specs.asset_key}
                addressable={input.asset.address}
                permissions={input.asset.permissions}
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
}: {
    assetKind: AssetKindT;
    input: {
        specs: TaskInputT;
        asset?: TaskIOAssetT;
    };
}): JSX.Element => {
    let content;

    if (input.specs.asset_key) {
        content = (
            <TaskInputValueRepresentation assetKind={assetKind} input={input} />
        );
    } else if (
        input.specs.parent_task_key &&
        input.specs.parent_task_output_identifier
    ) {
        content = (
            <HStack spacing="1.5">
                <Text noOfLines={1}>
                    From{' '}
                    <Link
                        href={compilePath(PATHS.TASK, {
                            key: input.specs.parent_task_key,
                        })}
                        color="primary.500"
                        fontWeight="semibold"
                        isExternal
                    >
                        {makeCompactAssetKey(input.specs.parent_task_key)}
                    </Link>
                    {''}.{input.specs.parent_task_output_identifier}
                </Text>
                <TaskInputValueRepresentation
                    assetKind={assetKind}
                    input={input}
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
}: {
    identifier: string;
    algoInput: InputT;
    inputs: {
        [key: string]: {
            specs: TaskInputT;
            asset?: TaskIOAssetT;
        };
    };
}): JSX.Element => {
    const icon = inputIcon(algoInput.kind);
    const title = identifier;

    if (algoInput.multiple || Object.keys(inputs).length > 1) {
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
                    {Object.entries(inputs).map(([index, input]) => (
                        <HStack spacing="2.5" key={index}>
                            <AngleIcon />
                            <TaskInputRepresentation
                                assetKind={algoInput.kind}
                                input={input}
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
                    input={Object.values(inputs)[0]}
                />
            </DrawerSectionEntry>
        );
    }
};

const TaskInputsDrawerSection = ({
    taskLoading,
    task,
}: {
    taskLoading: boolean;
    task: TaskT | null;
}): JSX.Element => {
    const dispatchWithAutoAbort = useDispatchWithAutoAbort();

    // Filtering assets to not call Datasamples as it can impact performance when there's a lot of them and doesn't contain additionnal info compared to task.inputs
    const kindFilter = useCallback(() => {
        Object.values(AssetKindT).filter(
            (kind) => kind !== AssetKindT.dataSample
        );
    }, []);

    useEffect(() => {
        if (task?.key) {
            dispatchWithAutoAbort(
                listTaskInputAssets({
                    key: task.key,
                    params: {
                        page: 1,
                        pageSize: 100,
                        kind: kindFilter,
                    },
                })
            );
        }
    }, [task, dispatchWithAutoAbort, kindFilter]);

    const taskInputAssets = useAppSelector(
        (state) => state.tasks.taskInputAssets
    );
    const taskInputAssetsLoading = useAppSelector(
        (state) => state.tasks.taskInputAssetsLoading
    );
    const loading = taskLoading || taskInputAssetsLoading;

    // Fusion algoInputs, task inputs specs & assets in an object to have the 'multiple' and 'optional' property
    const inputsPerIdentifier: {
        [identifier: string]: {
            algoInput: InputT;
            inputs: {
                [key: string]: {
                    specs: TaskInputT;
                    asset?: TaskIOAssetT;
                };
            };
        };
    } = {};

    if (!loading && task) {
        for (const [identifier, input] of Object.entries(task?.algo.inputs)) {
            inputsPerIdentifier[identifier] = {
                algoInput: input,
                inputs: {},
            };
        }

        for (const input of task.inputs) {
            if (input.asset_key) {
                inputsPerIdentifier[input.identifier].inputs[input.asset_key] =
                    { specs: input };
            } else if (input.parent_task_key) {
                inputsPerIdentifier[input.identifier].inputs[
                    input.parent_task_key
                ] = { specs: input };
            }
        }

        for (const inputAsset of taskInputAssets) {
            if (
                inputAsset.kind === AssetKindT.dataManager &&
                isDatasetStubT(inputAsset.asset) &&
                inputsPerIdentifier[inputAsset.identifier].inputs[
                    inputAsset.asset.key
                ]
            ) {
                inputsPerIdentifier[inputAsset.identifier].inputs[
                    inputAsset.asset.key
                ].asset = inputAsset.asset;
            } else if (
                inputAsset.kind === AssetKindT.model &&
                isModelT(inputAsset.asset) &&
                inputsPerIdentifier[inputAsset.identifier].inputs[
                    inputAsset.asset.compute_task_key
                ]
            ) {
                inputsPerIdentifier[inputAsset.identifier].inputs[
                    inputAsset.asset.compute_task_key
                ].asset = inputAsset.asset;
            }
        }
    }
    return (
        <DrawerSection title="Inputs">
            {task &&
                Object.entries(inputsPerIdentifier).map(
                    ([
                        identifier,
                        { algoInput: algoInput, inputs: inputs },
                    ]) => {
                        if (Object.keys(inputs).length > 0) {
                            return (
                                <TaskInputSectionEntry
                                    key={identifier}
                                    identifier={identifier}
                                    algoInput={algoInput}
                                    inputs={inputs}
                                />
                            );
                        }
                    }
                )}
        </DrawerSection>
    );
};

export default TaskInputsDrawerSection;
