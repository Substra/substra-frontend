import styled from '@emotion/styled';

import {
    alertInlineButton,
    alertTitle,
    alertWrapper,
} from '@substrafoundation/substra-ui';

import {
    secondaryAccent,
    iceSecondaryAccent,
} from '../../../../../assets/css/variables/colors';

export const AlertWrapper = styled('div')`
    ${alertWrapper};
    background-color: ${iceSecondaryAccent};
    border: 1px solid ${secondaryAccent};
`;
export const AlertTitle = styled('div')`
    ${alertTitle};
    color: ${secondaryAccent}
`;
export const AlertInlineButton = styled('button')`
    ${alertInlineButton};
    color: ${secondaryAccent}
`;
