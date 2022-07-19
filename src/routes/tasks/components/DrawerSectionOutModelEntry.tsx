import { isCompositeTraintuple } from '@/libs/tuples';
import {
    AggregatetupleT,
    CompositeTraintupleT,
    TraintupleT,
} from '@/modules/tasks/TuplesTypes';

import { DrawerSectionEntry } from '@/components/DrawerSection';

import DrawerSectionOutModelEntryContent from './DrawerSectionOutModelEntryContent';

const DrawerSectionOutModelEntry = ({
    task,
}: {
    task: TraintupleT | AggregatetupleT | CompositeTraintupleT;
}): JSX.Element => (
    <DrawerSectionEntry
        title={isCompositeTraintuple(task) ? 'Out models' : 'Out model'}
    >
        <DrawerSectionOutModelEntryContent task={task} />
    </DrawerSectionEntry>
);

export default DrawerSectionOutModelEntry;
