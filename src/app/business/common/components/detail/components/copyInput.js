import React from 'react';

import {CopyInput, Check} from '@substrafoundation/substra-ui';
import {primaryAccent} from '../../../../../../../assets/css/variables/colors';

const SuccessIcon = props => <Check color={primaryAccent} {...props} />;

export default props => <CopyInput SuccessIcon={SuccessIcon} {...props} />;
