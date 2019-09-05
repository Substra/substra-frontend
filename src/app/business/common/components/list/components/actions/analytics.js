import Actions from './index';
import withAnalytics, {
    LOG_FILTER_FROM_LIST, LOG_COPY_FROM_LIST, LOG_DOWNLOAD_FROM_LIST,
} from '../../../../../../analytics';


export const withActionsAnalytics = Component => withAnalytics(Component, [LOG_FILTER_FROM_LIST, LOG_COPY_FROM_LIST, LOG_DOWNLOAD_FROM_LIST]);

export default withActionsAnalytics(Actions);
