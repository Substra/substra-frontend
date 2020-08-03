import React from 'react';

import {primaryAccent} from '../../../../../../../assets/css/variables/colors';
import Check from '../../icons/check';
import CopyInput from '../../copyInput';

const SuccessIcon = (props) => <Check color={primaryAccent} {...props} />;

export default (props) => <CopyInput SuccessIcon={SuccessIcon} {...props} />;
