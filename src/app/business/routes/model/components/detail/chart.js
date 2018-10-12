import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {onlyUpdateForKeys} from 'recompose';
import connect from 'react-redux/es/connect/connect';
import ReactHighcharts from './highcharts';
import {getData} from '../../selector';

class Chart extends Component {

    over = false;

    getOppositePoint = (context) => {
        const chart = context.target.series.chart;

        const originalSerie = context.target.series;
        const originalSerieName = originalSerie.name.split('-')[0];
        const originalSerieindex = +originalSerie.name.split('-')[1];

        const oppositeSerieName = originalSerieName === 'owner' ? 'perf' : 'owner';
        const oppositeSerie = chart.series.find(x => x.name === `${oppositeSerieName}-${originalSerieindex}`);

        const index = originalSerie.data.findIndex(o => o.y === context.target.y && o.x === context.target.x);
        const originalPoint = originalSerie.data[index];
        const oppositePoint = oppositeSerie.data[index];

        return {originalPoint, oppositePoint, originalSerie, oppositeSerie};
    };

    afterRender = (chart) => {
        const {saveChart} = this.props;

        saveChart(chart);
    };

    mouseOver = (context) => {
        const {over, data} = this.props;

        const chart = context.target.series.chart;

        const {originalPoint, oppositePoint, originalSerie, oppositeSerie} = this.getOppositePoint(context);

        if (!this.over) {

            console.log('update over from ', this.oldIndex, ' to ', data.perf.length + 1);
            if (originalSerie.userOptions.zIndex !== data.perf.length + 1) {
                originalPoint.setState('hover');
                oppositePoint.setState('hover');

                setTimeout(() => {
                    this.over = true;
                    this.oldIndex = originalSerie.userOptions.zIndex;
                    // TODO optimize
                    chart.series.map(o => o.update({zIndex: +o.name.split('-')[1]}));
                    // update zIndex
                    originalSerie.update({zIndex: data.perf.length + 1});
                    oppositeSerie.update({zIndex: data.perf.length + 1});

                    //chart.series.redraw();
                }, 0);
            }
        }

        // TODO debug flash
        over(originalPoint.key);
    };

    mouseOut = (context) => {
        const {out} = this.props;

        const chart = context.target.series.chart;

        const {originalPoint, oppositePoint, originalSerie} = this.getOppositePoint(context);
        originalPoint.setState();
        oppositePoint.setState();

        if (this.over && originalSerie.userOptions.zIndex !== this.oldIndex) {
            console.log('update out to ', this.oldIndex);
            this.over = false;
            chart.series.map(o => o.update({zIndex: +o.name.split('-')[1]}));
        }

        out(originalPoint.key);
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
                            mouseOver: context => this.mouseOver(context),
                            mouseOut: context => this.mouseOut(context),
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

const mapStateToProps = (state, {model}) => ({
    data: getData(state, model),
});

const mapDispatchToProps = (dispatch, {actions}) => bindActionCreators({
    saveChart: actions.chart.save,
}, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(onlyUpdateForKeys(['data'])(Chart));
