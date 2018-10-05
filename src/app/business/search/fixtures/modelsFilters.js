import challenge from './challenge';
import dataset from './dataset';
import algo from './algo';
import {endModelsHashes} from './traintuples';

export default {
    challenge,
    dataset,
    algo,
    model: endModelsHashes, // output model i.e trained model (updated)
    model_parents: endModelsHashes,
    model_children: endModelsHashes,
    model_family: endModelsHashes,
};
