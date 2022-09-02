import {
    isTesttuple,
    isPredicttuple,
    isCompositeTraintuple,
    isTraintuple,
} from '@/libs/tuples';
import { AssetKindT } from '@/modules/algos/AlgosTypes';
import {
    getTaskDataset,
    getTaskDataSampleKeys,
} from '@/modules/tasks/TasksUtils';
import { AnyFullTupleT } from '@/modules/tasks/TuplesTypes';

import { DrawerSection } from '@/components/DrawerSection';

import DrawerSectionDatasamplesEntry from './DrawerSectionDatasamplesEntry';
import DrawerSectionInModelsEntry from './DrawerSectionInModelsEntry';
import DrawerSectionOpenerEntry from './DrawerSectionOpenerEntry';

const TaskInputsDrawerSection = ({
    loading,
    task,
}: {
    loading: boolean;
    task: AnyFullTupleT | null;
}): JSX.Element => {
    let dataset;
    let dataSampleKeys;
    let models;
    let modelNames: string[];

    if (
        task &&
        (isTesttuple(task) ||
            isPredicttuple(task) ||
            isCompositeTraintuple(task) ||
            isTraintuple(task))
    ) {
        dataset = getTaskDataset(task);
        dataSampleKeys = getTaskDataSampleKeys(task);
        modelNames = Object.entries(task.algo.inputs)
            .filter(([, input]) => input.kind === AssetKindT.model)
            .map(([key]) => key);
        models = Object.values(task.inputs).filter((input) =>
            modelNames.includes(input.identifier)
        );
    }

    return (
        <DrawerSection title="Inputs">
            <DrawerSectionDatasamplesEntry
                loading={loading}
                task={task}
                dataSampleKeys={dataSampleKeys}
            />
            <DrawerSectionOpenerEntry
                loading={loading}
                task={task}
                dataset={dataset}
            />
            <DrawerSectionInModelsEntry loading={loading} models={models} />
        </DrawerSection>
    );
};

export default TaskInputsDrawerSection;
