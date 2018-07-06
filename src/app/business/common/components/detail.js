import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

const Detail = ({selected, className}) => (
    <div className={className}>
        <ul>
            {selected.map(o => (
                <li key={`detail-${o}`}>
                    {o}
                </li>
            ))}
        </ul>
    </div>
);

const mapStateToProps = (state, {model}) => ({
    selected: state[model].list.selected,
    results: state[model].list.results,
});

Detail.defaultProps = {
    selected: [],
    className: '',
};

Detail.propTypes = {
    selected: PropTypes.arrayOf(PropTypes.string),
    className: PropTypes.string,
};

export default connect(mapStateToProps)(Detail);
