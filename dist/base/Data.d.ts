import { DataType, ParallelDataType } from './DataTypes';
export declare enum Scenario {
    PY = "PY",
    AC = "AC",
    FC = "FC",
    PL = "PL"
}
export type Data<Type extends DataType> = ({
    key: string;
} & Type)[];
export declare const stackValues: (metaDataPoints: any) => any[];
export type Value = {
    value?: number;
    scenario?: Scenario;
};
export type ParallelValues = {
    left: Value;
    primary: {
        positiveStackValue?: number;
        negativeStackValue?: number;
        values?: Value[];
    };
    right: Value;
};
export declare const extractParallelValues: (dataPoint: ParallelDataType) => ParallelValues;
export declare const extractValues: (dataPoint: any) => {
    left: any[];
    right: any[];
    primary: any[];
};
