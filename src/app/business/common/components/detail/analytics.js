import Detail from './index';
import withAnalytics, {LOG_COPY_FROM_DETAIL, LOG_DOWNLOAD_FROM_DETAIL, LOG_FILTER_FROM_DETAIL} from '../../../../analytics';

export const withDetailAnalytics = Component => withAnalytics(Component, [LOG_FILTER_FROM_DETAIL, LOG_DOWNLOAD_FROM_DETAIL, LOG_COPY_FROM_DETAIL]);

export default withDetailAnalytics(Detail);
