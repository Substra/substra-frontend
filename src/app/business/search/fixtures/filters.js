import challenge from './challenge';
import dataset from './dataset';
import algo from './algo';
import {outModelsHashes} from './traintuples';

export default {
    challenge,
    dataset,
    algo,
    model: outModelsHashes, // output model i.e trained model (updated)
};
