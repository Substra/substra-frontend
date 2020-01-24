import React from 'react';
import PropTypes from 'prop-types';
import {capitalize} from 'lodash';
import {
PopList, FilterUpPopItem, PopItem, Action,
} from '../../../../../common/components/list/components/popoverItems';
import {deepGet} from '../../../../../../utils/selector';

const CopyPopItem = ({addNotification, assetName, assetKey}) => (
    <PopItem>
        <Action onClick={addNotification(assetKey, `${capitalize(assetName)}'s key successfully copied to clipboard!`)}>
            {`Copy ${assetName}'s key to clipboard`}
        </Action>
    </PopItem>
);

CopyPopItem.propTypes = {
    addNotification: PropTypes.func.isRequired,
    assetName: PropTypes.string.isRequired,
    assetKey: PropTypes.string.isRequired,
};


const StandardModelPopoverItems = ({item, filterUp, addNotification}) => {
    const modelKey = deepGet('traintuple.outModel.hash')(item);
    const traintupleKey = deepGet('traintuple.key')(item);
    return (
        <>
            <PopList>
                <FilterUpPopItem filterUp={filterUp} />
                {modelKey && <CopyPopItem addNotification={addNotification} assetKey={modelKey} assetName="model" />}
                <CopyPopItem addNotification={addNotification} assetKey={traintupleKey} assetName="traintuple" />
            </PopList>
        </>
    );
};


const CompositeModelPopoverItems = ({item, filterUp, addNotification}) => {
    const headModelKey = deepGet('traintuple.outHeadModel.outModel.hash')(item);
    const trunkModelKey = deepGet('traintuple.outTrunkModel.outModel.hash')(item);
    const traintupleKey = deepGet('traintuple.key')(item);

    return (
        <PopList>
            <FilterUpPopItem filterUp={filterUp} />
            <CopyPopItem addNotification={addNotification} assetKey={traintupleKey} assetName="composite traintuple" />
            {headModelKey && <CopyPopItem addNotification={addNotification} assetKey={headModelKey} assetName="head model" />}
            {trunkModelKey && <CopyPopItem addNotification={addNotification} assetKey={trunkModelKey} assetName="trunk model" />}
        </PopList>
    );
};

const AggregateModelPopoverItems = ({item, filterUp, addNotification}) => {
    const modelKey = deepGet('traintuple.outModel.hash')(item);
    const traintupleKey = deepGet('traintuple.key')(item);

    return (
        <PopList>
            <FilterUpPopItem filterUp={filterUp} />
            {modelKey && <CopyPopItem addNotification={addNotification} assetKey={modelKey} assetName="model" />}
            <CopyPopItem addNotification={addNotification} assetKey={traintupleKey} assetName="aggregatetuple" />
        </PopList>
    );
};

StandardModelPopoverItems.propTypes = CompositeModelPopoverItems.propTypes = AggregateModelPopoverItems.propTypes = {
    item: PropTypes.shape().isRequired,
    filterUp: PropTypes.func.isRequired,
    addNotification: PropTypes.func.isRequired,
};

const ModelPopoverItems = (props) => {
    const {item} = props;
    const type = item && item.traintuple && item.traintuple.type;

    return (
        <>
            {type === 'standard' && <StandardModelPopoverItems {...props} />}
            {type === 'composite' && <CompositeModelPopoverItems {...props} />}
            {type === 'aggregate' && <AggregateModelPopoverItems {...props} />}
        </>
    );
};

ModelPopoverItems.propTypes = {
    item: PropTypes.shape().isRequired,
};


export default ModelPopoverItems;
