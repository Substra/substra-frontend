import { memo } from 'react';

import { Handle, Position } from 'reactflow';

import { Box, Text, Flex } from '@chakra-ui/react';

import { getStatusLabel } from '@/libs/status';
import {
    NODE_BORDER_COLOR,
    NODE_LABEL_COLOR,
} from '@/routes/computePlanDetails/workflow/CPWorkflowUtils';
import { PositionedTaskT } from '@/types/CPWorkflowTypes';

type TaskNodeProps = {
    data: PositionedTaskT;
};

const TaskNode = ({ data }: TaskNodeProps) => {
    const handleTopMargin = 48;
    const handleElementMargin = 18;
    const handleRadius = 60;
    return (
        <>
            {/*Handles*/}
            {data.inputs_specs.map((value, index) => (
                <Box key={value.identifier}>
                    <Handle
                        type="target"
                        position={Position.Left}
                        id={value.identifier}
                        style={{
                            borderRadius: handleRadius,
                            top: handleTopMargin + handleElementMargin * index,
                            background: NODE_LABEL_COLOR[data.status],
                            boxShadow: `0 0 0 2px white, 0 0 0 4px ${
                                NODE_LABEL_COLOR[data.status]
                            }`,
                            cursor: 'default',
                        }}
                    />
                </Box>
            ))}
            {data.outputs_specs.map((value, index) => (
                <Box key={value.identifier}>
                    <Handle
                        type="source"
                        position={Position.Right}
                        id={value.identifier}
                        style={{
                            borderRadius: handleRadius,
                            top: handleTopMargin + handleElementMargin * index,
                            background: NODE_LABEL_COLOR[data.status],
                            boxShadow: `0 0 0 2px white, 0 0 0 4px ${
                                NODE_LABEL_COLOR[data.status]
                            }`,
                            cursor: 'default',
                        }}
                    />
                </Box>
            ))}

            <Box fontSize="12px" padding={0}>
                {/*Header*/}
                <Box
                    padding="6px"
                    backgroundColor={NODE_BORDER_COLOR[data.status]}
                    color="white"
                >
                    <Text fontWeight="bold" noOfLines={1}>
                        {data.function_name}
                    </Text>
                </Box>

                {/*Input/output labels*/}
                <Box
                    borderTop={`2px solid ${NODE_BORDER_COLOR[data.status]}`}
                    padding="6px"
                    color="darkslategray"
                >
                    <Flex display="flex" gap="6px">
                        <Box flex="50%" textAlign="left">
                            {data.inputs_specs.map((value) => (
                                <Text
                                    margin="0 auto 0 3px"
                                    key={value.identifier}
                                >
                                    {value.identifier}
                                </Text>
                            ))}
                        </Box>
                        <Box flex="50%" textAlign="right">
                            {data.outputs_specs.map((value) => (
                                <Text
                                    margin="0 3px 0 auto"
                                    key={value.identifier}
                                >
                                    {value.identifier}
                                </Text>
                            ))}
                        </Box>
                    </Flex>
                </Box>

                <Box
                    borderTop={`2px solid ${NODE_BORDER_COLOR[data.status]}`}
                    marginTop="3px"
                    padding="6px"
                    color="darkslategray"
                >
                    <Flex gap="8px">
                        <Box textAlign="left">
                            <Text margin="0 auto 0 auto">worker</Text>
                            <Text margin="0 auto 0 auto">rank</Text>
                            <Text margin="0 auto 0 auto">status</Text>
                        </Box>
                        <Box textAlign="left">
                            <Text margin="0 auto 0 auto">{data.worker}</Text>
                            <Text margin="0 auto 0 auto">{data.rank}</Text>
                            <Text
                                display="inline-block"
                                margin="0 auto 0 auto"
                                padding="2px 4px 2px 4px"
                                backgroundColor={NODE_LABEL_COLOR[data.status]}
                                color="white"
                                borderRadius={3}
                                fontSize={10}
                                fontWeight="medium"
                            >
                                {getStatusLabel(data.status)}
                            </Text>
                        </Box>
                    </Flex>
                </Box>
            </Box>
        </>
    );
};

const MemoizedTaskNode = memo(TaskNode);
export default MemoizedTaskNode;
