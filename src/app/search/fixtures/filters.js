import objective from './objective';
import dataset from './dataset';
import algo from './algo';
import {outModelsHashes} from './traintuples';

export default {
    objective,
    dataset,
    algo,
    model: outModelsHashes, // output model i.e trained model (updated)
};
