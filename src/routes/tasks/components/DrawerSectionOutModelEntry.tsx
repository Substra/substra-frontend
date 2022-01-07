import DrawerSectionOutModelEntryContent from './DrawerSectionOutModelEntryContent';

import {
    Aggregatetuple,
    CompositeTraintuple,
    Traintuple,
} from '@/modules/tasks/TuplesTypes';

import { isCompositeTraintuple } from '@/libs/tuples';

import { DrawerSectionEntry } from '@/components/DrawerSection';

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
