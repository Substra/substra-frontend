import React from 'react';
import PopoverItems, {
PopList, FilterUpPopItem, DownloadPopItem, CopyPopItem,
} from '../../../../../common/components/list/components/popoverItems';


const ModelPopoverItems = ({
model, filterUp, addNotification, downloadFile, download, item,
}) => (
    <PopList>
        <FilterUpPopItem filterUp={filterUp} />
        <CopyPopItem model={model} addNotification={addNotification} />
        {item && item.traintuple.outModel && <DownloadPopItem downloadFile={downloadFile} download={download} />}
    </PopList>
);

ModelPopoverItems.propTypes = PopoverItems.propTypes;
ModelPopoverItems.defaultProps = PopoverItems.defaultProps;

export default ModelPopoverItems;
