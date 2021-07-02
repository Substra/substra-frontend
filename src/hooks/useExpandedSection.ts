import { setExpandedSection } from '@/modules/ui/UISlice';

import useAppDispatch from './useAppDispatch';
import useAppSelector from './useAppSelector';

const useExpandedSection = (
    sectionName: string
): [boolean, (expanded: boolean) => void] => {
    const expandedSectionName = useAppSelector(
        (state) => state.ui.expandedSection
    );
    const dispatch = useAppDispatch();
    const expanded = expandedSectionName === sectionName;
    const setExpanded = (expanded: boolean) => {
        if (expanded) {
            dispatch(setExpandedSection(sectionName));
        } else {
            dispatch(setExpandedSection(''));
        }
    };
    return [expanded, setExpanded];
};

export default useExpandedSection;
