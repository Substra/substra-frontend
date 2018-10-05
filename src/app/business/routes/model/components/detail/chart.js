import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import connect from 'react-redux/es/connect/connect';
import ReactHighcharts from './highcharts';

class Chart extends Component {

    getOppositePoint = (context) => {
        const chart = context.target.series.chart;

        const originalSerie = context.target.series;
        const originalSerieName = originalSerie.name.split('-')[0];
        const originalSerieindex = originalSerie.name.split('-')[1];

        const oppositeSerieName = originalSerieName === 'owner' ? 'perf' : 'owner';
        const oppositeSerie = chart.series.find(x => x.name === `${oppositeSerieName}-${originalSerieindex}`);

        const index = originalSerie.data.findIndex(x => x.y === context.target.y);
        const originalPoint = originalSerie.data[index];
        const oppositePoint = oppositeSerie.data[index];

        return {originalPoint, oppositePoint};
    };

    afterRender = (chart) => {
        const {saveChart} = this.props;

        saveChart(chart);
    };

    config = () => {
        const {config, over, out} = this.props;

        return {
            ...config,
            plotOptions: {
                ...config.plotOptions,
                series: {
                    ...config.plotOptions.series,
                    point: {
                        events: {
                            mouseOver: (context) => {
                                const chart = context.target.series.chart;

                                const {originalPoint, oppositePoint} = this.getOppositePoint(context);

                                originalPoint.setState('hover');
                                oppositePoint.setState('hover');
                                chart.tooltip.refresh(originalPoint);

                                over(originalPoint.key);
                            },
                            mouseOut: (context) => {
                                const chart = context.target.series.chart;

                                const {originalPoint, oppositePoint} = this.getOppositePoint(context);
                                originalPoint.setState('');
                                oppositePoint.setState('');
                                chart.tooltip.refresh(oppositePoint);

                                out(originalPoint.key);
                            },
                        },
                    },
                },
            },
        };
    };

    render() {
        return <ReactHighcharts config={this.config()} callback={this.afterRender}/>;
    }
}


const mapDispatchToProps = (dispatch, {actions}) => bindActionCreators({
    saveChart: actions.chart.save,
}, dispatch);

const noop = () => ({});

export default connect(noop, mapDispatchToProps)(Chart);
