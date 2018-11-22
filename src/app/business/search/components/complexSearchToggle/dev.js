import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Switch from '@material-ui/core/Switch';

import actions from '../../actions';

class ComplexSearchToggle extends React.Component {
    handleIsComplex = (e) => {
        const {setIsComplex} = this.props;

        setIsComplex(e.target.checked);
    };

    render() {
        const {isComplex} = this.props;
        return (
            <div>
                <Switch
                    checked={isComplex}
                    onChange={this.handleIsComplex}
                />
                <span>Is Complex?</span>
            </div>
        );
    }
}

ComplexSearchToggle.propTypes = {
    isComplex: PropTypes.bool.isRequired,
    setIsComplex: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    isComplex: state.search.isComplex,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setIsComplex: actions.isComplex.set,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ComplexSearchToggle);
