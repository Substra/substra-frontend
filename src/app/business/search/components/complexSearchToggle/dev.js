import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import actions from '../../actions';

class ComplexSearchToggle extends Component {
    handleIsComplex = (e) => {
        const {setIsComplex} = this.props;

        setIsComplex(e.target.checked);
    };

    render() {
        const {isComplex} = this.props;
        return (
            <label>
                <input
                    type="checkbox"
                    checked={isComplex}
                    onChange={this.handleIsComplex}
                />
                <span>Is Complex?</span>
            </label>
        );
    }
}

ComplexSearchToggle.defaultProps = {
    isComplex: false,
};

ComplexSearchToggle.propTypes = {
    isComplex: PropTypes.bool,
    setIsComplex: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    isComplex: state.search.isComplex,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setIsComplex: actions.isComplex.set,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ComplexSearchToggle);
