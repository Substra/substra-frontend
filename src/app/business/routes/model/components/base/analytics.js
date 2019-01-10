import Base from './index';
import withAnalytics, {LOG_COPY_FROM_LIST, LOG_DOWNLOAD_FROM_LIST, LOG_FILTER_FROM_LIST} from '../../../../../analytics';

export default withAnalytics(Base, [LOG_FILTER_FROM_LIST, LOG_COPY_FROM_LIST, LOG_DOWNLOAD_FROM_LIST]);
