import React from 'react';
import Actions, {
    actions,
    FilterAction,
} from '../../../../../common/components/detail/components/actions';

const ModelActions = ({filterUp}) => (
    <div className={actions}>
        <FilterAction filterUp={filterUp} />
    </div>
);

ModelActions.propTypes = Actions.propTypes;
ModelActions.defaultProps = Actions.defaultProps;

export default ModelActions;
