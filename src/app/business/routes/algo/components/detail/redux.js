import {withDetailAnalytics} from '../../../../common/components/detail/analytics';
import {withDetailRedux} from '../../../../common/components/detail/redux';
import AlgoDetail from './index';


export default withDetailRedux(withDetailAnalytics(AlgoDetail));
