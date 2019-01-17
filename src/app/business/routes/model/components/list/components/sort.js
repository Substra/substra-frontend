import Sort from '../../../../../common/components/list/components/sort';

export default class ModelSort extends Sort {
    selectWidth = '140px';

    options = [
        {value: 'testData.perf-asc', label: 'Lowest score'},
        {value: 'testData.perf-desc', label: 'Highest score'},
    ];
}
