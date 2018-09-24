import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {isArray} from 'lodash';

import {List} from '../../../../common/components/list';
import {getOrderedResults} from '../../../model/selector';
import {getItem} from '../../../../common/selector';

import Popover from './popover';

// update addNotification, more
class Index extends List {
    addNotification = (key, text) => (e) => {
        e.preventDefault();
        e.stopPropagation();

        const {addNotification, itemResults} = this.props;
        const item = itemResults.find(x => x.key === this.state.popover.item.key);

        if (item) {
            const inputValue = isArray(item[key]) ? item[key].join(',') : item[key];
            addNotification(inputValue, text);
        }

        this.popoverHandleClose();
    };

    more = (o) => (e) => {
        e.preventDefault();
        e.stopPropagation();

        const {fetchItem, itemResults} = this.props;

        const item = itemResults.find(x => x.key === o.key);

        // load item for getting data keys
        if (!item) {
            fetchItem({key: o.key});
        }

        // display menu
        this.setState({
            popover: {
                open: true,
                anchorEl: e.currentTarget,
                item: o,
            },
        });
        e.persist();
    };
}

const mapStateToProps = (state, {model, filterUp, downloadFile, download, addNotification, more}) => ({
    init: state[model].list.init,
    loading: state[model].list.loading,
    itemLoading: state[model].item.loading,
    itemResults: state[model].item.results,
    results: getOrderedResults(state, model),
    selected: state[model].list.selected,
    order: state[model].order,
    item: getItem(state, model),
    model,
    download,
    filterUp,
    downloadFile,
    addNotification,
    more,
    Popover,
});

const mapDispatchToProps = (dispatch, {actions}) => bindActionCreators({
    fetchList: actions.list.request,
    setSelected: actions.list.selected,
    setOrder: actions.order.set,
    fetchItem: actions.item.request,
}, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(Index);
