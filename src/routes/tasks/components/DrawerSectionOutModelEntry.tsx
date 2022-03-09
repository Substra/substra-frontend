import { isCompositeTraintuple } from '@/libs/tuples';
import {
    Aggregatetuple,
    CompositeTraintuple,
    Traintuple,
} from '@/modules/tasks/TuplesTypes';

import { DrawerSectionEntry } from '@/components/DrawerSection';

import DrawerSectionOutModelEntryContent from './DrawerSectionOutModelEntryContent';

const DrawerSectionOutModelEntry = ({
    task,
}: {
    task: Traintuple | Aggregatetuple | CompositeTraintuple;
}): JSX.Element => (
    <DrawerSectionEntry
        title={isCompositeTraintuple(task) ? 'Out models' : 'Out model'}
    >
        <DrawerSectionOutModelEntryContent task={task} />
    </DrawerSectionEntry>
);

export default DrawerSectionOutModelEntry;
