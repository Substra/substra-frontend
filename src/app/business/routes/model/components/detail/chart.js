import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {onlyUpdateForKeys} from 'recompose';
import connect from 'react-redux/es/connect/connect';
import ReactHighcharts from './highcharts';
import {getConfig, getData, hover} from '../../selector';

// helper
export const getOppositePoint = (context) => {
    const chart = context.target.series.chart;

    const originalSerie = context.target.series;
    const originalSerieName = originalSerie.name.split('-')[0];
    const originalSerieindex = +originalSerie.name.split('-')[1];

    const oppositeSerieName = originalSerieName === 'owner' ? 'perf' : 'owner';
    const oppositeSerie = chart.series.find(x => x.name === `${oppositeSerieName}-${originalSerieindex}`);

    const index = originalSerie.data.findIndex(o => o.y === context.target.y && o.x === context.target.x);
    const originalPoint = originalSerie.data[index];
    const oppositePoint = oppositeSerie.data[index];

    return {
originalPoint, oppositePoint, originalSerie, oppositeSerie,
};
};

class Chart extends Component {
    afterRender = (chart) => {
        const {saveChart} = this.props;
        saveChart(chart);
    };

    mouseOver = (context) => {
        const {setChartKeyHover, data, selected} = this.props;
        const {
originalPoint, oppositePoint, originalSerie, oppositeSerie,
} = getOppositePoint(context);

        const hoverZindex = data.perf.length + 1;

        originalSerie.group.attr({zIndex: hoverZindex});
        originalSerie.markerGroup.attr({zIndex: hoverZindex});
        oppositeSerie.group.attr({zIndex: hoverZindex});
        oppositeSerie.markerGroup.attr({zIndex: hoverZindex});

        if (selected !== originalPoint.key) {
            oppositePoint.update({
                marker: {fillColor: '#fff', lineColor: hover, lineWidth: 2},
            });
            originalPoint.update({
                marker: {fillColor: '#fff', lineColor: hover, lineWidth: 2},
            });
        }

        setChartKeyHover(originalPoint.key);
    };

    mouseOut = (context) => {
        const {setChartKeyHover, selected} = this.props;
        const {
originalPoint, oppositePoint, originalSerie, oppositeSerie,
} = getOppositePoint(context);

        const originaleZindex = +originalSerie.name.split('-')[1],
            oppositeZindex = +oppositeSerie.name.split('-')[1];

        originalSerie.group.attr({zIndex: originaleZindex});
        originalSerie.markerGroup.attr({zIndex: originaleZindex});
        oppositeSerie.group.attr({zIndex: oppositeZindex});
        oppositeSerie.markerGroup.attr({zIndex: oppositeZindex});

        if (selected !== originalPoint.key) {
            oppositePoint.update({
                marker: {fillColor: oppositeSerie.userOptions.color, lineWidth: 0},
            });
            originalPoint.update({
                marker: {fillColor: originalSerie.userOptions.color, lineWidth: 0},
            });
        }

        setChartKeyHover();
    };

    config = () => {
        const {config} = this.props;
        return {
            ...config,
            plotOptions: {
                ...config.plotOptions,
                series: {
                    ...config.plotOptions.series,
                    point: {
                        events: {
                            mouseOver: this.mouseOver,
                            mouseOut: this.mouseOut,
                        },
                    },
                },
            },
        };
    };

    render() {
        return <ReactHighcharts config={this.config()} callback={this.afterRender} />;
    }
}

Chart.propTypes = {
    saveChart: PropTypes.func.isRequired,
    setChartKeyHover: PropTypes.func.isRequired,
    data: PropTypes.shape(),
    selected: PropTypes.string,
    config: PropTypes.shape().isRequired,
};

Chart.defaultProps = {
    data: {},
    selected: null,
};


const mapStateToProps = (state, {model}) => ({
    data: getData(state, model),
    config: getConfig(state, model),
    selected: state[model].list.selected,
});

const mapDispatchToProps = (dispatch, {actions}) => bindActionCreators({
    saveChart: actions.chart.save,
    setChartKeyHover: actions.chart.hoverKey.set,
}, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(onlyUpdateForKeys(['data', 'config'])(Chart));
