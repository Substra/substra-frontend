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

const mapStateToProps = state => ({
    selected: state.problem.list.selected,
    results: state.problem.list.results
});

export default connect(mapStateToProps)(Detail);
