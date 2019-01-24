import List from './index';
import withAnalytics, {
LOG_LIST, LOG_DETAIL, LOG_FILTER_FROM_LIST, LOG_COPY_FROM_LIST, LOG_DOWNLOAD_FROM_LIST,
} from '../../../../analytics';

export const withListAnalytics = Component => withAnalytics(Component, [LOG_LIST, LOG_DETAIL, LOG_FILTER_FROM_LIST, LOG_COPY_FROM_LIST, LOG_DOWNLOAD_FROM_LIST]);

export default withListAnalytics(List);
