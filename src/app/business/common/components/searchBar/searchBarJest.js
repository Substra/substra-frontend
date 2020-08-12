import {uniqBy} from 'lodash';

export const defaultState = {
    inputValue: '',
    isParent: true,
    selectedItem: [],
    suggestions: [],
    parentSuggestions: [],
};

export const suggestions = [
    'AAAA:1',
    'AAAA:2',
    'BBBB:1',
    'BBBB:3',
];

export const getSuggestions = (isParent, selectedItem, item) => {
    const isLogic = item === '-OR-';
    const level_1 = uniqBy(suggestions.map((s) => ({label: s.split(':')[0]})), 'label');

    if (isParent) {
        return {
            suggestions: [
                ...(selectedItem.length && !isLogic ? [{label: '-OR-', isLogic: true}] : []),
                ...level_1,
            ],
            parentSuggestions: level_1,
            item: isLogic ? '' : item,
        };
    }

    const s = suggestions.reduce((p, c) => {
        const [parent, child] = c.split(':');
        return [
            ...p,
            ...(parent === selectedItem[0].parent ? [{label: child}] : []),
        ];
    }, []);
    const level_2 = uniqBy(s, 'label');

    return {
        suggestions: level_2,
        parentSuggestions: level_1,
    };
};
