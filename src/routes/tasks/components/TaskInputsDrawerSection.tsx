import { useEffect, useState } from 'react';

import { HStack, Link, List, Text } from '@chakra-ui/react';

import * as TasksApi from '@/api/TasksApi';
import { getAllPages } from '@/api/request';
import AngleIcon from '@/assets/svg/angle-icon.svg';
import useAuthStore from '@/features/auth/useAuthStore';
import useCanDownloadModel from '@/hooks/useCanDownloadModel';
import useHasPermission from '@/hooks/useHasPermission';
import { compilePath, PATHS } from '@/paths';
import { getAssetKindLabel } from '@/routes/functions/FunctionsUtils';
import { FileT, PermissionsT } from '@/types/CommonTypes';
import { isDatasetStubT } from '@/types/DatasetTypes';
import { AssetKindT, FunctionInputT } from '@/types/FunctionsTypes';
import { isModelT } from '@/types/ModelsTypes';
import { TaskInputT, TaskT, TaskIOT } from '@/types/TasksTypes';

import DownloadIconButton from '@/components/DownloadIconButton';
import {
    DrawerSection,
    DrawerSectionCollapsibleEntry,
    DrawerSectionEntry,
} from '@/components/DrawerSection';

import { getTaskIOIcon } from '../TasksUtils';
import TaskIOPermissions from './TaskIOPermissions';

const makeCompactAssetKey = (key: string): string => {
    return `${key.slice(0, 5)}...${key.slice(-5)}`;
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
    permissions,
}: {
    assetKey?: string;
    addressable?: FileT;
    permissions?: PermissionsT;
}): JSX.Element => {
    const hasDownloadPermission = useHasPermission();

    return (
        <HStack spacing="2.5" onClick={(e) => e.stopPropagation()}>
            {assetKey && (
                <Text noOfLines={1} flexGrow="1">
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
                    aria-label={
                        permissions &&
                        hasDownloadPermission(permissions.download)
                            ? 'Download opener'
                            : 'Restricted download'
                    }
                    size="xs"
                    placement="top"
                    isDisabled={
                        permissions &&
                        !hasDownloadPermission(permissions.download)
                    }
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
    const {
        info: {
            config: { model_export_enabled: modelExportEnabled },
        },
    } = useAuthStore();
    const canDownloadModel = useCanDownloadModel();
    let content;

    if (permissions && !canDownloadModel(permissions)) {
        content = (
            <HStack spacing="1.5">
                {assetKey && (
                    <Text as="span" fontSize="xs" lineHeight="4" flexGrow="1">
                        {assetKey}
                    </Text>
                )}
                <DownloadIconButton
                    filename="model"
                    aria-label={
                        modelExportEnabled
                            ? 'Restricted download'
                            : 'Model export is not enabled'
                    }
                    size="xs"
                    placement="top"
                    disabled
                />
            </HStack>
        );
    } else if (!addressable?.storage_address) {
        content = (
            <Text color="gray.500">Intermediary model no longer available</Text>
        );
    } else {
        content = (
            <HStack spacing="1.5">
                {assetKey && <Text flexGrow="1">{assetKey}</Text>}
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
                permissions={inputAsset.asset.permissions}
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
        <Text noOfLines={1} color="gray.400" fontSize="xs">
            Not available
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
            <HStack spacing="1.5" flexGrow="1">
                <Text noOfLines={1} flexGrow="1">
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
    functionInput,
    inputs,
    inputsAssets,
}: {
    identifier: string;
    functionInput: FunctionInputT;
    inputs: TaskInputT[];
    inputsAssets: TaskIOT[];
}): JSX.Element => {
    const icon = getTaskIOIcon(functionInput.kind);
    const title = identifier;

    if (functionInput.multiple || inputs.length > 1) {
        //  '|| inputs.length > 1' is for resilience to inconsistent data

        return (
            <DrawerSectionCollapsibleEntry
                icon={icon}
                title={title}
                titleStyle="code"
                aboveFold={
                    <Text color="gray.500">
                        {Object.keys(inputs).length}{' '}
                        {`${getAssetKindLabel(functionInput.kind)}${
                            Object.keys(inputs).length > 1 ? 's' : ''
                        }`}
                    </Text>
                }
                permissions={
                    functionInput.kind !== AssetKindT.dataManager &&
                    functionInput.kind !== AssetKindT.model
                        ? null
                        : undefined
                }
            >
                <List spacing={2.5}>
                    {inputs.map((input, index) => {
                        const inputAsset = getInputAsset({
                            input,
                            inputsAssets,
                        });
                        return (
                            <HStack key={index} spacing="2.5" flexGrow="1">
                                <AngleIcon />
                                {inputAsset &&
                                (isModelT(inputAsset.asset) ||
                                    isDatasetStubT(inputAsset.asset)) ? (
                                    <TaskIOPermissions
                                        permissions={
                                            inputAsset.asset.permissions
                                        }
                                    />
                                ) : undefined}
                                <TaskInputRepresentation
                                    assetKind={functionInput.kind}
                                    input={input}
                                    inputAsset={inputAsset}
                                />
                            </HStack>
                        );
                    })}
                </List>
            </DrawerSectionCollapsibleEntry>
        );
    } else {
        const inputAsset = getInputAsset({
            input: inputs[0],
            inputsAssets,
        });

        return (
            <DrawerSectionEntry
                icon={icon}
                title={title}
                titleStyle="code"
                alignItems="center"
                permissions={
                    inputAsset &&
                    (isModelT(inputAsset.asset) ||
                        isDatasetStubT(inputAsset.asset))
                        ? inputAsset.asset.permissions
                        : null
                }
            >
                <TaskInputRepresentation
                    assetKind={functionInput.kind}
                    input={inputs[0]}
                    inputAsset={inputAsset}
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
    const [taskInputsAssets, setTaskInputsAssets] = useState<TaskIOT[]>([]);

    useEffect(() => {
        if (task) {
            getTaskInputAssets(task.key).then((result) =>
                setTaskInputsAssets(result)
            );
        }
    }, [task]);

    const getInputsAssets = (identifier: string): TaskIOT[] =>
        taskInputsAssets.filter(
            (taskInputAsset) => taskInputAsset.identifier === identifier
        );

    return (
        <DrawerSection title="Inputs">
            {task &&
                !taskLoading &&
                Object.entries(task.function.inputs).map(
                    ([identifier, functionInput]) => {
                        const inputs = task.inputs.filter(
                            (input) => input.identifier === identifier
                        );
                        if (inputs.length > 0) {
                            return (
                                <TaskInputSectionEntry
                                    key={identifier}
                                    identifier={identifier}
                                    functionInput={functionInput}
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
