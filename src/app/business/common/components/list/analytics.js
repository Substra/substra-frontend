import List from './index';
import withAnalytics, {LOG_LIST, LOG_DETAIL} from '../../../../analytics';

export default withAnalytics(List, [LOG_LIST, LOG_DETAIL]);
