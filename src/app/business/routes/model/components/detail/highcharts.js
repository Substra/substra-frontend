import ReactHighcharts from 'react-highcharts';

if (ReactHighcharts.Highcharts.Axis) {
    ReactHighcharts.Highcharts.wrap(ReactHighcharts.Highcharts.Axis.prototype, 'getPlotLinePath', (proceed, lineWidth) => {
        const linePath = proceed.call(this, lineWidth);

        if (this.options.arrowOnEnd) {
            const arrowFactor = 20;

            // origin
            const x = linePath[4];
            const y = linePath[5];

            const arrowPath = [
                'M', x - 0.35 * arrowFactor, y - 0.35 * arrowFactor,
                'L', x, y,
                'L', x - 0.35 * arrowFactor, y + 0.35 * arrowFactor,
            ];
            return linePath.concat(arrowPath);
        }

        return linePath;
    });

    ReactHighcharts.Highcharts.wrap(ReactHighcharts.Highcharts.Axis.prototype, 'getLinePath', (p, lineWidth) => {
        const linePath = p.call(this, lineWidth);

        if (this.options.arrowOnEnd) {
            const arrowFactor = 20;
            let x,
                y;

            // up
            x = linePath[1];
            y = linePath[2];
            const upArrowPath = [
                'M', x - 0.35 * arrowFactor, y + 0.35 * arrowFactor, // left
                'L', x, y, // origin
                'L', x + 0.35 * arrowFactor, y + 0.35 * arrowFactor, // right
            ];

            // down
            x = linePath[4];
            y = linePath[5];
            const downArrowPath = [
                'M', x + 0.35 * arrowFactor, y - 0.35 * arrowFactor, // left
                'L', x, y, // origin
                'L', x - 0.35 * arrowFactor, y - 0.35 * arrowFactor, // right
            ];

            return linePath.concat(upArrowPath).concat(downArrowPath);
        }

        return linePath;
    });
}

export default ReactHighcharts;
