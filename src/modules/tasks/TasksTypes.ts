import {
    TraintupleT,
    CompositeTraintupleT,
    AggregatetupleT,
    TesttupleT,
} from './TuplesTypes';

export { TupleStatus as TaskStatus } from './TuplesTypes';

export interface TrainTaskT extends TraintupleT {
    type: 'traintuple';
}

export interface CompositeTrainTaskT extends CompositeTraintupleT {
    type: 'composite_traintuple';
}

export interface AggregateTaskT extends AggregatetupleT {
    type: 'aggregatetuple';
}

export interface TestTaskT extends TesttupleT {
    type: 'testtuple';
}

export type AnyTaskT =
    | TrainTaskT
    | CompositeTrainTaskT
    | AggregateTaskT
    | TestTaskT;

export type TaskType =
    | 'traintuple'
    | 'composite_traintuple'
    | 'aggregatetuple'
    | 'testtuple';
