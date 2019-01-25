import React from 'react';
import Actions, {
    actions,
    DownloadAction,
    FilterAction,
} from '../../../../../common/components/detail/components/actions';

const ModelActions = ({
filterUp, downloadFile, model, item,
}) => (
    <div className={actions}>
        {item && item.endModel && <DownloadAction downloadFile={downloadFile} model={model} />}
        <FilterAction filterUp={filterUp} />
    </div>
);

ModelActions.propTypes = Actions.propTypes;
ModelActions.defaultProps = Actions.defaultProps;

export default ModelActions;
