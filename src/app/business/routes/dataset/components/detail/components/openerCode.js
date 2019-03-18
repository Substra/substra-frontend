import React from 'react';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {PulseLoader} from 'react-spinners';
import {noop} from 'lodash';

import CodeSample from '../../../../../common/components/detail/components/codeSample';
import {getItem} from '../../../../../common/selector';
import actions from '../../../actions';

class OpenerCode extends React.Component {
    fetchOpenerFileIfNeeded() {
        const {fetchOpener, item, openerLoading} = this.props;
        if (item && !openerLoading && !item.opener.content) {
            fetchOpener({
                id: item.key,
                url: item.opener.storageAddress,
            });
        }
    }

    componentDidMount() {
        this.fetchOpenerFileIfNeeded();
    }

    componentDidUpdate() {
        this.fetchOpenerFileIfNeeded();
    }

    render() {
        const {openerLoading, item} = this.props;
        if (openerLoading) {
            return <PulseLoader size={6} />;
        }
        if (item && item.opener && item.opener.content) {
            return (
                <CodeSample
                    filename="opener.py"
                    language="python"
                    codeString={item.opener.content}
                />
            );
        }
        return null;
    }
}

OpenerCode.propTypes = {
    openerLoading: PropTypes.bool,
    item: PropTypes.shape(),
    fetchOpener: PropTypes.func,
};

OpenerCode.defaultProps = {
    openerLoading: false,
    item: null,
    fetchOpener: noop,
};

const mapStateToProps = state => ({
    item: getItem(state, 'dataset'),
    openerLoading: state.dataset.item.openerLoading,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchOpener: actions.item.opener.request,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(OpenerCode);
