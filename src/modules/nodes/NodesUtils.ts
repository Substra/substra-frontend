import { NodeType } from './NodesTypes';

declare const MELLODDY: boolean;

export const MELLODDY_LARGE5_NODE_IDS: string[] = [
    'pharma10',
    'pharma8',
    'pharma1',
    'pharma5',
    'pharma6',
];
export const MELLODDY_SMALL5_NODE_IDS: string[] = [
    'pharma3',
    'pharma4',
    'pharma7',
    'pharma2',
    'pharma9',
];

export const STATIC_AVERAGE_NODE_IDS: string[] = [
    'average',
    'small5_average',
    'large5_average',
    'pharma_average',
];

const compareString = (a: string, b: string): 1 | 0 | -1 => {
    if (a < b) {
        return -1;
    } else if (a === b) {
        return 0;
    } else {
        return 1;
    }
};

export const compareNodes = (nodeA: NodeType, nodeB: NodeType): 1 | 0 | -1 => {
    const nodeALabel = nodeA.id;
    const nodeBLabel = nodeB.id;

    const res = compareString(
        nodeALabel.toLowerCase(),
        nodeBLabel.toLowerCase()
    );
    if (res === 0) {
        return compareString(nodeALabel, nodeBLabel);
    }
    return res;
};

export const isAverageNode = (nodeId: string): boolean => {
    if (!MELLODDY) {
        return false;
    }
    return STATIC_AVERAGE_NODE_IDS.includes(nodeId);
};
