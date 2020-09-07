import uuidv4 from 'uuid/v4';

import {BaseComponent} from '../../../../common/components/base';
import withAddNotification from '../../../../common/components/copyNotification/copyNotification';
import {Check} from '../../../../common/components/icons';


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
