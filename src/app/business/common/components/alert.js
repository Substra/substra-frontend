import styled from '@emotion/styled';

import {
    alertInlineButton,
    AlertActions,
    alertTitle,
    alertWrapper,
} from '@substrafoundation/substra-ui';

import {
    secondaryAccent,
    iceSecondaryAccent,
} from '../../../../../assets/css/variables/colors';

const AlertWrapper = styled('div')`
    ${alertWrapper};
    background-color: ${iceSecondaryAccent};
    border: 1px solid ${secondaryAccent};
`;
const AlertTitle = styled('div')`
    ${alertTitle};
    color: ${secondaryAccent}
`;
const AlertInlineButton = styled('button')`
    ${alertInlineButton};
    color: ${secondaryAccent}
`;

export {
    AlertWrapper,
    AlertTitle,
    AlertActions,
    AlertInlineButton,
};
