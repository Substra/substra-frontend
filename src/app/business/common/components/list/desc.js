import React from 'react';
import {css} from 'react-emotion';

export const desc = css`
    display: inline-block;
    vertical-align: top;
    margin-left: 10px;
`;

const Description = ({o}) => (
    <div className={desc}>
        {o.metrics
        && (
        <span>
            {`Metric: ${o.metrics.name}`}
        </span>
)
        }
    </div>
);

export default Description;
