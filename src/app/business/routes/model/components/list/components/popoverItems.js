import React from 'react';
import PopoverItems, {
PopList, FilterUpPopItem, CopyPopItem,
} from '../../../../../common/components/list/components/popoverItems';


const ModelPopoverItems = ({
model, filterUp, addNotification,
}) => (
    <PopList>
        <FilterUpPopItem filterUp={filterUp} />
        <CopyPopItem model={model} addNotification={addNotification} />
    </PopList>
);

ModelPopoverItems.propTypes = PopoverItems.propTypes;
ModelPopoverItems.defaultProps = PopoverItems.defaultProps;

export default ModelPopoverItems;
