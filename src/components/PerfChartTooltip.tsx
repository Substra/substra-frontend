import { Fragment, useEffect, useState } from 'react';

import styled from '@emotion/styled';

import { Model } from '@/modules/tasks/ModelsTypes';
import { getHeadModel, getSimpleModel } from '@/modules/tasks/ModelsUtils';
import {
    retrieveAggregateTuple,
    retrieveCompositeTraintuple,
    retrieveTraintuple,
} from '@/modules/tasks/TasksApi';
import {
    Aggregatetuple,
    CompositeTraintupleStub,
    TaskCategory,
    TraintupleStub,
} from '@/modules/tasks/TuplesTypes';

import { downloadFromApi } from '@/libs/request';

import { DataPoint } from '@/hooks/useBuildPerfChartDataset';
import useCanDownloadModel from '@/hooks/useCanDownloadModel';
import useNodeChartStyle from '@/hooks/useNodeChartStyle';

import { compilePath, PATHS } from '@/routes';

import PerfChartMarker from '@/components/PerfChartMarker';
import Spinner from '@/components/Spinner';
import StyledLink from '@/components/StyledLink';

import { Colors, Fonts, Spaces } from '@/assets/theme';

const TOOLTIP_WIDTH = 340;

interface TooltipProps {
    x: number;
    y: number;
}

const Tooltip = styled.ul<TooltipProps>`
    position: absolute;
    left: calc(${({ x }) => x}px - 18px);
    top: calc(${({ y }) => y}px + 8px);
    width: ${TOOLTIP_WIDTH}px;
    border: 1px solid ${Colors.border};
    background-color: ${Colors.darkerBackground};
    border-radius: 4px;
    padding: ${Spaces.extraSmall} ${Spaces.small};
    font-size: ${Fonts.sizes.smallBody};
    z-index: 1;
`;

const TooltipLi = styled.li`
    display: flex;
    align-items: baseline;
    margin-bottom: ${Spaces.extraSmall};
    &:last-child {
        margin-bottom: 0;
    }
`;

const Dl = styled.dl`
    display: grid;
    grid-template-columns: 55px 1fr;
    align-items: center;
`;

const DownloadButton = styled.button`
    padding: ${Spaces.small} ${Spaces.medium};
    color: ${Colors.primary};
    background: none;
    border: 1px solid ${Colors.border};
    border-radius: 20px;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-top: ${Spaces.small};

    &:hover {
        background-color: ${Colors.darkerBackground};
    }

    &:active {
        background-color: white;
    }
`;

interface DownloadModelProps {
    model: Model;
    buttonLabel: string;
    filename: string;
}
const DownloadModel = ({
    model,
    buttonLabel,
    filename,
}: DownloadModelProps): JSX.Element | null => {
    const canDownloadModel = useCanDownloadModel();

    if (!model.address || !canDownloadModel(model.permissions)) {
        return (
            <Fragment>
                <dt>Model</dt>
                <dd>Not available for download</dd>
            </Fragment>
        );
    }

    const onClick = () => {
        const url = model.address?.storage_address || '';
        downloadFromApi(url, filename);
    };

    return (
        <Fragment>
            <dt>
                {filename === 'model' && 'Model'}
                {filename === 'trunk_model' && 'Trunk model'}
                {filename === 'head_model' && 'Head model'}
            </dt>
            <dd>
                <DownloadButton onClick={onClick}>{buttonLabel}</DownloadButton>
            </dd>
        </Fragment>
    );
};

async function retrieveTask(
    key: string
): Promise<TraintupleStub | CompositeTraintupleStub | Aggregatetuple> {
    let response;
    try {
        response = await retrieveTraintuple(key);
        return response.data;
    } catch {
        //eslint-disable-next-line: no-empty
    }

    try {
        response = await retrieveCompositeTraintuple(key);
        return response.data;
    } catch {
        //eslint-disable-next-line: no-empty
    }

    response = await retrieveAggregateTuple(key);
    return response.data;
}

interface DownloadModelsProps {
    taskKeys: string[];
}
const DownloadModels = ({ taskKeys }: DownloadModelsProps): JSX.Element => {
    const [loading, setLoading] = useState(false);
    const [links, setLinks] = useState<DownloadModelProps[]>([]);

    useEffect(() => {
        async function getLinks() {
            const tasks = [];
            for (const taskKey of taskKeys) {
                tasks.push(await retrieveTask(taskKey));
            }

            // find out what is the role of each task and of its models
            let model, trunkModel, headModel;
            if (tasks.length === 1) {
                const task = tasks[0];
                if (task.category === TaskCategory.composite) {
                    trunkModel = getSimpleModel(task);
                    headModel = getHeadModel(task);
                } else {
                    model = getSimpleModel(task);
                }
            } else if (tasks.length === 2) {
                if (tasks[0].category === TaskCategory.aggregate) {
                    trunkModel = getSimpleModel(tasks[0]);
                    headModel = getHeadModel(tasks[1]);
                } else {
                    trunkModel = getSimpleModel(tasks[1]);
                    headModel = getHeadModel(tasks[0]);
                }
            }

            setLoading(false);
            setLinks([
                ...(model
                    ? [
                          {
                              model: model,
                              buttonLabel: 'Download model',
                              filename: 'model',
                          },
                      ]
                    : []),
                ...(trunkModel
                    ? [
                          {
                              model: trunkModel,
                              buttonLabel: 'Download trunk model',
                              filename: 'trunk_model',
                          },
                      ]
                    : []),
                ...(headModel
                    ? [
                          {
                              model: headModel,
                              buttonLabel: 'Download head model',
                              filename: 'head_model',
                          },
                      ]
                    : []),
            ]);
        }

        setLoading(true);
        getLinks();
    }, [taskKeys]);

    return (
        <Fragment>
            {loading && (
                <Fragment>
                    <dt>Model</dt>
                    <dd>
                        <Spinner /> Loading download link...
                    </dd>
                </Fragment>
            )}
            {!loading &&
                links.map((link) => (
                    <DownloadModel {...link} key={link.model.key} />
                ))}
        </Fragment>
    );
};

interface PerfChartTooltipProps {
    x: number;
    y: number;
    showTooltip: () => void;
    hideTooltip: () => void;
    points: DataPoint[];
}

const PerfChartTooltip = ({
    x,
    y,
    showTooltip,
    hideTooltip,
    points,
}: PerfChartTooltipProps): JSX.Element => {
    const nodeChartStyle = useNodeChartStyle();

    return (
        <Tooltip
            x={x}
            y={y}
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
        >
            {points.map((point) => (
                <TooltipLi key={point.testTaskKey}>
                    <PerfChartMarker
                        style={nodeChartStyle(point.worker).pointStyle}
                        color={nodeChartStyle(point.worker).color}
                    />
                    <Dl>
                        <dt>Perf</dt>
                        <dd>{point.y}</dd>
                        <dt>Rank</dt>
                        <dd>{point.x}</dd>
                        <dt>Test task</dt>
                        <dd>
                            <StyledLink
                                href={compilePath(PATHS.TASK, {
                                    key: point.testTaskKey,
                                })}
                            >
                                {point.testTaskKey}
                            </StyledLink>
                        </dd>
                        <DownloadModels taskKeys={point.parentTaskKeys} />
                    </Dl>
                </TooltipLi>
            ))}
        </Tooltip>
    );
};

export default PerfChartTooltip;
