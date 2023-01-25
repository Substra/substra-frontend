import { OrganizationT } from '@/types/OrganizationsTypes';

const compareString = (a: string, b: string): 1 | 0 | -1 => {
    if (a < b) {
        return -1;
    } else if (a === b) {
        return 0;
    } else {
        return 1;
    }
};

export const compareOrganizations = (
    nodeA: OrganizationT | string,
    nodeB: OrganizationT | string
): 1 | 0 | -1 => {
    const nodeALabel = typeof nodeA === 'string' ? nodeA : nodeA.id;
    const nodeBLabel = typeof nodeB === 'string' ? nodeB : nodeB.id;

    const res = compareString(
        nodeALabel.toLowerCase(),
        nodeBLabel.toLowerCase()
    );
    if (res === 0) {
        return compareString(nodeALabel, nodeBLabel);
    }
    return res;
};
