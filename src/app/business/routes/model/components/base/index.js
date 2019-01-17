import uuidv4 from 'uuid/v4';

import Base from '../../../../common/components/base';
import ReduxBase from '../../../../common/components/base/redux';
import {withBaseAnalytics} from '../../../../common/components/base/analytics';

class ModelBase extends Base {
    filterUp = (o) => {
        const {
            setSearchState, selectedItem, model, logFilterFromList,
        } = this.props;

        const newSelectedItem = [
            ...selectedItem,
            // This is the -OR- case
            // ...(selectedItem.length && !last(selectedItem).isLogic ? [{
            //     parent: '-OR-',
            //     isLogic: true,
            //     uuid: uuidv4(),
            // }] : []),
            {
                parent: model,
                child: `hash:${o}`,
                isLogic: false,
                uuid: uuidv4(),
            }];

        setSearchState({
            isParent: true,
            inputValue: '',
            selectedItem: newSelectedItem,
            item: o,
            toUpdate: true,
        });
        logFilterFromList(selectedItem.key);
    };
}

export default ReduxBase(withBaseAnalytics(ModelBase));
