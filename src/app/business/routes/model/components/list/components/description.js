import React from 'react';
import PropTypes from 'prop-types';

import {desc} from '../../../../../common/components/list/components/desc';

const Description = ({o}) => (
    <div className={desc}>
        {o && o.status && (
            <div>
                {`Status: ${o.status}`}
            </div>
        )}
        {o && o.testData && (
            <div>
                {`Score: ${o.testData.perf}`}
            </div>
        )}
    </div>
);

Description.propTypes = {
    o: PropTypes.shape(),
};

Description.defaultProps = {
    o: null,
};

export default Description;
