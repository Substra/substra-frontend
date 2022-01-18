import { NodeType } from './NodesTypes';

declare const MELLODDY: boolean;

const MELLODDY_ID_PSEUDONYMS: Record<string, string> = {
    OrggskMSP: 'pharma1',
    OrgmerckMSP: 'pharma2',
    OrgamgenMSP: 'pharma3',
    OrgastellasMSP: 'pharma4',
    OrgjnjMSP: 'pharma5',
    OrgnovartisMSP: 'pharma6',
    OrgbayerMSP: 'pharma7',
    OrgbiMSP: 'pharma8',
    OrgservierMSP: 'pharma9',
    OrgastrazenecaMSP: 'pharma10',
};

export const MELLODDY_LARGE5_NODE_IDS: string[] = [
    'OrgamgenMSP',
    'OrgastellasMSP',
    'OrgbayerMSP',
    'OrgmerckMSP',
    'OrgservierMSP',
];
export const MELLODDY_SMALL5_NODE_IDS: string[] = [
    'OrgastrazenecaMSP',
    'OrgbiMSP',
    'OrggskMSP',
    'OrgjnjMSP',
    'OrgnovartisMSP',
];

export const getNodeLabel = (nodeId: string): string => {
    if (MELLODDY) {
        return MELLODDY_ID_PSEUDONYMS[nodeId] || nodeId;
    }
    return nodeId;
};

export const compareNodes = (nodeA: NodeType, nodeB: NodeType): 1 | 0 | -1 => {
    const nodeALabel = getNodeLabel(nodeA.id);
    const nodeBLabel = getNodeLabel(nodeB.id);

    if (nodeALabel < nodeBLabel) {
        return -1;
    } else if (nodeALabel === nodeBLabel) {
        return 0;
    } else {
        return 1;
    }
};

export const isAverageNode = (nodeId: string): boolean => {
    if (!MELLODDY) {
        return false;
    }
    return ['average', 'small5_average', 'large5_average'].includes(nodeId);
};
