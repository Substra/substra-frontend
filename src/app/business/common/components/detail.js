import React, {Component} from 'react';
import {connect} from 'react-redux';

class Detail extends Component {
    render() {

        const {selected, results, className} = this.props;

        return (<div className={className}>
            <ul>
                {selected.map(o =>
                    <li key={`detail-${o}`}>
                        {o}
                    </li>
                )}
            </ul>
        </div>)
    }
}

const mapStateToProps = (state, {model}) => ({
    selected: state[model].list.selected,
    results: state[model].list.results
});

export default connect(mapStateToProps)(Detail);
