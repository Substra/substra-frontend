import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {isArray} from 'lodash';

import BaseActions from '../../../../../common/components/list/components/actions';
import PopoverItems from './popoverItems';
import actions from '../../../actions';

class DatasetActions extends BaseActions {
    addNotification = (key, text) => (e) => {
        e.preventDefault();
        e.stopPropagation();

        const {
            addNotification, itemResults, item,
        } = this.props;

        const itemDetails = itemResults.find((x) => x.key === item.key);

        if (itemDetails) {
            const inputValue = isArray(itemDetails[key]) ? JSON.stringify(itemDetails[key]) : itemDetails[key];
            addNotification(inputValue, text);
        }

        this.togglePopover();
    };

    togglePopover = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        const {isOpen} = this.state;
        const {fetchItem, itemResults, item} = this.props;

        const itemDetails = itemResults.find((x) => x.key === item.key);

        // load item for getting data keys
        if (!itemDetails) {
            fetchItem({key: item.key});
        }

        this.setState({isOpen: !isOpen});
    };

    popoverContent = () => {
        const {
            PopoverItems, item, model, download, itemLoading,
        } = this.props;
        return (
            <PopoverItems
                model={model}
                download={download}
                filterUp={this.filterUp}
                downloadFile={this.downloadFile}
                addNotification={this.addNotification}
                item={item}
                itemLoading={itemLoading}
            />
        );
    };
}

DatasetActions.propTypes = {
    ...BaseActions.propTypes,
    itemResults: PropTypes.arrayOf(PropTypes.shape()),
    itemLoading: PropTypes.bool,
};

DatasetActions.defaultProps = {
    ...BaseActions.defaultProps,
    itemResults: null,
    itemLoading: false,
};

const mapStateToProps = (state, {model}) => ({
    itemResults: state[model].item.results,
    itemLoading: state[model].item.loading,
    PopoverItems,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    fetchItem: actions.item.request,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DatasetActions);
