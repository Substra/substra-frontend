import uuidv4 from 'uuid/v4';
import {Check, withAddNotification} from '@substrafoundation/substra-ui';

import {BaseComponent} from '../../../../common/components/base';


class ModelBase extends BaseComponent {
    filterUp = (o) => {
        const {
            setSearchState, selectedItem, model,
        } = this.props;

        const newSelectedItem = [
            ...selectedItem,
            {
                parent: model,
                child: `key:${o}`,
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
    };
}

const ModelBaseWithAddNotification = withAddNotification(ModelBase, Check);

export default ModelBaseWithAddNotification;
