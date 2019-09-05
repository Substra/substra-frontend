import List from './index';
import withAnalytics, {
    LOG_LIST, LOG_DETAIL,
} from '../../../../analytics';

export const withListAnalytics = Component => withAnalytics(Component, [LOG_LIST, LOG_DETAIL]);

export default withListAnalytics(List);
