import React from 'react';

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
import { AssetKindT, InputT } from '@/modules/algos/AlgosTypes';
import { getAssetKindLabel } from '@/modules/algos/AlgosUtils';
import { FileT, PermissionsT } from '@/modules/common/CommonTypes';
import { TaskInputT, TaskT } from '@/modules/tasks/TasksTypes';
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
    assetKind: string;
    input: TaskInputT;
}): JSX.Element => {
    switch (assetKind) {
        case AssetKindT.dataManager:
            return (
                <OpenerRepresentation
                    assetKey={input.asset_key}
                    addressable={input.addressable}
                />
            );
        case AssetKindT.dataSample:
            return <DatasampleRepresentation assetKey={input.asset_key} />;
        case AssetKindT.model:
            return (
                <ModelRepresentation
                    assetKey={input.asset_key}
                    addressable={input.addressable}
                    permissions={input.permissions}
                />
            );
        case AssetKindT.performance:
            return <p>{input.asset_key}</p>;
        default:
            return <p>No representation for kind {assetKind}</p>;
    }
};

const TaskInputRepresentation = ({
    assetKind,
    input,
}: {
    assetKind: string;
    input: TaskInputT;
}): JSX.Element => {
    let content;

    if (input.asset_key) {
        content = (
            <TaskInputValueRepresentation assetKind={assetKind} input={input} />
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
    inputs: TaskInputT[];
}): JSX.Element => {
    const icon = inputIcon(algoInput.kind);
    const title = identifier;

    if (algoInput.multiple || inputs.length > 1) {
        //  '|| inputs.length > 1' is for resilience to inconsistent data
        return (
            <DrawerSectionCollapsibleEntry
                icon={icon}
                title={title}
                titleStyle="code"
                aboveFold={
                    <Text color="gray.500">
                        {inputs.length}{' '}
                        {`${getAssetKindLabel(algoInput.kind)}${
                            inputs.length > 1 ? 's' : ''
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
                />
            </DrawerSectionEntry>
        );
    }
};

const TaskInputsDrawerSection = ({
    loading,
    task,
}: {
    loading: boolean;
    task: TaskT | null;
}): JSX.Element => {
    // Fusion algoInputs and task inputs in an object to have the 'multiple' and 'optional' property
    const inputsPerIdentifier: {
        [identifier: string]: { algoInput: InputT; inputs: TaskInputT[] };
    } = {};
    if (!loading && task) {
        for (const [identifier, input] of Object.entries(task?.algo.inputs)) {
            inputsPerIdentifier[identifier] = {
                algoInput: input,
                inputs: [],
            };
        }
        for (const input of task.inputs) {
            inputsPerIdentifier[input.identifier].inputs.push(input);
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
                        if (inputs.length > 0) {
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
