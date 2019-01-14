import Base from './index';
import withAnalytics, {LOG_COPY_FROM_LIST, LOG_DOWNLOAD_FROM_LIST, LOG_FILTER_FROM_LIST} from '../../../../analytics';

export const withBaseAnalytics = Component => withAnalytics(Component, [LOG_FILTER_FROM_LIST, LOG_COPY_FROM_LIST, LOG_DOWNLOAD_FROM_LIST]);

export default withBaseAnalytics(Base);
