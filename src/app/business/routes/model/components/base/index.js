import uuidv4 from 'uuid/v4';
import ReduxBase from '../../../../common/components/base/redux';
import {withBaseAnalytics} from '../../../../common/components/base/analytics';
import Base, {
    verticalBar, anchorOrigin, ClipboardContent, middle, snackbarContent,
} from '../../../../common/components/base';

import Check from '../../../../common/svg/check';
import {ice, tealish, white} from '../../../../../../../assets/css/variables/colors';
import {spacingLarge} from '../../../../../../../assets/css/variables/spacing';
import {hover} from '../../selector';

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
