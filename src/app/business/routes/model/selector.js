import {
    flatten, orderBy, uniqBy, last,
} from 'lodash';
import {Decimal} from 'decimal.js';

import createDeepEqualSelector from '../../../utils/selector';
import {flattenUniq} from '../../common/selector';

const results = (state, model) => state[model].list.results;
const selected = (state, model) => state[model].list.selected;
const order = (state, model) => state[model].order;
const isComplex = state => state.search.isComplex;
const filters = state => state.search.filters;

export const getColumns = createDeepEqualSelector([results],
    // put name in first
    results => results && results.length && results[0].length ? [...Object.keys(results[0][0]).filter(o => !['algo', 'challenge', 'startModel', 'endModel', 'testData', 'trainData'].includes(o))] : [],
);

export const getOrderedResults = createDeepEqualSelector([results, order, isComplex],
    (results, order, isComplex) => {
        const res = results && results.length ? results.map(o => orderBy(o, [order.by], [order.direction])) : [];

        return isComplex ? res : [uniqBy(flatten(res), 'key')];
    },
);

export const getChallengeFilters = createDeepEqualSelector([filters],
    filters => filters.filter((x) => {
        const arr = x.split(':');
        return arr.length > 2 & arr[0] === 'challenge';
    }),
);


const step = 0.1;
const start = 0.1;
const direction = -1;

const stepDirection = new Decimal(direction).times(step);
const startDirection = new Decimal(start).times(direction);

export const getData = createDeepEqualSelector([getOrderedResults],
    (results) => {
        // will try to find start -> end -> start -> end -> start Model chaining
        const data = flattenUniq(results).reduce((p, c) => {
            let perf = p.perf || [];
            const perfItem = {
                key: c.key,
                name: `${c.algo.name}-${c.key.slice(0, 4)}`,
                perf: c.testData.perf,
                startModel: c.startModel,
                endModel: c.endModel,
            };
            perf = perf.map((o) => {
                // find if we find its startModel as an EndModel from a previous one _OR_
                // if we find its endModel as a startModel from a previous one

                const nextItemIndex = o.findIndex(x => x.endModel && c.startModel ? x.endModel.hash === c.startModel.hash : false);
                const prevItemIndex = o.findIndex(x => x.startModel && c.endModel ? x.startModel.hash === c.endModel.hash : false);

                let res = o;
                if (~nextItemIndex) {
                    // put c after the nextItem
                    res = [...o.slice(0, nextItemIndex + 1), perfItem, ...o.slice(nextItemIndex + 1, o.length)];
                }
                else if (~prevItemIndex) {
                    // put c before the prevItem
                    res = [...o.slice(0, prevItemIndex), perfItem, ...o.slice(prevItemIndex, o.length)];
                }

                return res;
            });

            // if c has not been added in perf via next or prev, add it
            if (!flatten(perf).includes(perfItem)) {
                perf = [...perf, [perfItem]];
            }

            const owner = p.owner || {
                series: [],
                results: [],
            };

            const ownerItem = {
                key: c.key,
                name: `${c.algo.name}-${c.key.slice(0, 4)}`,
                owner: c.trainData.worker,
                startModel: c.startModel,
                endModel: c.endModel,
            };

            owner.series = owner.series.map((o) => {
                // find if we find its startModel as an EndModel from a previous one _OR_
                // if we find its endModel as a startModel from a previous one

                const nextItemIndex = o.findIndex(x => x.endModel && c.startModel ? x.endModel.hash === c.startModel.hash : false);
                const prevItemIndex = o.findIndex(x => x.startModel && c.endModel ? x.startModel.hash === c.endModel.hash : false);

                let res = o;
                if (~nextItemIndex) {
                    // put c after the nextItem
                    res = [...o.slice(0, nextItemIndex + 1), ownerItem, ...o.slice(nextItemIndex + 1, o.length)];
                    // add owner in results if not present
                    if (!owner.results.map(o => o.owner).includes(c.trainData.worker)) {
                        owner.results = [...owner.results, {
                            owner: c.trainData.worker,
                            rank: owner.results.length ? stepDirection.plus(last(owner.results).rank).toNumber() : startDirection.toNumber(),
                        }];
                    }
                }
                else if (~prevItemIndex) {
                    // put c before the prevItem
                    res = [...o.slice(0, prevItemIndex), ownerItem, ...o.slice(prevItemIndex, o.length)];
                    // add owner in results if not present
                    if (!owner.results.map(o => o.owner).includes(c.trainData.worker)) {
                        owner.results = [...owner.results, {
                            owner: c.trainData.worker,
                            rank: owner.results.length ? stepDirection.plus(last(owner.results).rank).toNumber() : startDirection.toNumber(),
                        }];
                    }
                }

                return res;
            });

            // if c has not been added in perf via next or prev, add it
            if (!flatten(owner.series).includes(ownerItem)) {
                owner.series = [...owner.series, [ownerItem]];
                owner.results = [
                    ...owner.results,
                    ...(owner.results.find(x => x.owner === c.trainData.worker) ? [] : [
                        {
                            owner: c.trainData.worker,
                            rank: owner.results.length ? stepDirection.plus(last(owner.results).rank).toNumber() : startDirection.toNumber(),
                        },
                    ]),
                ];
            }

            return {
                ...p,
                perf,
                owner,
            };
        }, {});

        return data;
    },
);

const colors = [
    '#5B72B7',
    '#1DBCC0',
    '#ED5937',
    '#BA6AAB',
    '#8ca0ea',
    '#67eff3',
    '#fff452',
    '#ff8b63',
    '#ee9add',
    '#284787',
    '#008b90',
    '#b69200',
    '#b4240b',
    '#883c7c',
];

export const hover = '#edc20f';

export const getConfig = createDeepEqualSelector([getData, selected],
    (data, selected) => ({
        legend: {
            enabled: false,
        },
        credits: {
            enabled: false,
        },
        title: '',
        xAxis: [
            {
                lineWidth: 0,
                labels: {
                    enabled: false,
                },
                tickWidth: 0,
                min: 0,
                max: data.owner && data.owner.series ? Math.max(...data.owner.series.map(o => o.length)) : 1,
            },
            {
                lineWidth: 0,
            },
        ],
        yAxis: [
            {
                title: {
                    text: 'Data center',
                    align: 'low',
                    margin: 20,
                },
                lineColor: '#4b6073',
                lineWidth: 2,
                gridLineWidth: 0,
                labels: {
                    formatter: (point) => {
                        const owner = data.owner.results.find(x => x.rank === point.value);
                        return owner ? owner.owner.slice(0, 4) : (point.value <= 1 && point.value >= 0 ? point.value : '');
                    },
                },
                max: 1.1,
                tickInterval: step,
                plotLines: [{
                    color: '#4b6073',
                    width: 2,
                    value: 0,
                }],
                arrowOnEnd: true,

            },
            {
                title: {
                    text: 'Performance: AUC',
                    align: 'middle',
                    margin: -15,
                },
            },
        ],
        tooltip: {
            formatter() {
                return this.key;
            },
        },
        plotOptions: {
            series: {
                pointStart: 0,
                animation: false,
                stickyTracking: false,
                marker: {
                    states: {
                        hover: {
                            fillColor: 'white',
                            lineColor: hover,
                            lineWidth: 2,
                            radiusPlus: 0,
                        },
                    },
                    radius: 5,
                },
                states: {
                    hover: {
                        enabled: false, // handle it manually
                        halo: {
                            size: 0,
                        },
                        lineWidthPlus: 0,
                    },
                    normal: {
                        animation: {
                            duration: 0,
                        },
                    },
                },
            },
        },
        series: [
            ...(data.owner && data.owner.series ? data.owner.series.map((o, i) => ({
                data: o.map((x, j) => ({
                    x: j,
                    y: data.owner.results.find(y => y.owner === x.owner).rank,
                    name: x.name,
                    key: x.key,
                    color: selected === x.key ? hover : (i < colors.length ? colors[i] : colors[0]),
                    noTooltip: false,
                })),
                yAxis: 0,
                xAxis: 0,
                marker: {
                    symbol: 'round',
                },
                name: `owner-${i}`,
                color: i < colors.length ? colors[i] : colors[0],
                zIndex: o.find(x => x.key === selected) ? data.owner.series.length + 1 : i,
            })) : []),
            ...(data.perf ? data.perf.map((o, i) => ({
                data: o.map((x, j) => ({
                    x: j,
                    y: x.perf,
                    name: x.name,
                    key: x.key,
                    color: selected === x.key ? hover : (i < colors.length ? colors[i] : colors[0]),
                    noTooltip: false,
                })),
                yAxis: 0,
                xAxis: 0,
                marker: {
                    symbol: 'round',
                },
                name: `perf-${i}`,
                color: i < colors.length ? colors[i] : colors[0],
                zIndex: o.find(x => x.key === selected) ? data.perf.length + 1 : i,
            })) : []),
        ],
    }),
);

export default {
    getColumns,
    getOrderedResults,
    getChallengeFilters,
    getData,
    getConfig,
};
