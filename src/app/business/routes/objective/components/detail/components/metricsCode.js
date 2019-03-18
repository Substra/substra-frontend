import React from 'react';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {PulseLoader} from 'react-spinners';
import {noop} from 'lodash';

import CodeSample from '../../../../../common/components/detail/components/codeSample';
import {getItem} from '../../../../../common/selector';
import actions from '../../../actions';

class MetricsCode extends React.Component {
    fetchMetricsFileIfNeeded() {
        const {fetchMetrics, item, metricsLoading} = this.props;
        if (item && !metricsLoading && (!item.metrics || !item.metrics.content)) {
            fetchMetrics({
                id: item.key,
                url: item.metrics.storageAddress,
            });
        }
    }

    componentDidMount() {
        this.fetchMetricsFileIfNeeded();
    }

    componentDidUpdate() {
        this.fetchMetricsFileIfNeeded();
    }

    render() {
        const {metricsLoading, item} = this.props;
        if (metricsLoading) {
            return <PulseLoader size={6} />;
        }
        if (item && item.metrics && item.metrics.content) {
            return (
                <CodeSample
                    filename="metrics.py"
                    language="python"
                    codeString={item.metrics.content}
                />
            );
        }
        return null;
    }
}

MetricsCode.propTypes = {
    metricsLoading: PropTypes.bool,
    item: PropTypes.shape(),
    fetchMetrics: PropTypes.func,
};

MetricsCode.defaultProps = {
    metricsLoading: false,
    item: null,
    fetchMetrics: noop,
};

const mapStateToProps = state => ({
    item: getItem(state, 'objective'),
    metricsLoading: state.objective.item.metricsLoading,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchMetrics: actions.item.metrics.request,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MetricsCode);
