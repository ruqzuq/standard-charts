import { Scenario } from './Data';

export type SimpleDataType = {
  [Scenario.AC]: number;
};

export type ParallelDataType = {
  [key in Scenario]?: number;
};

export type StackedDataType =
  | {
      [Scenario.PY]: number[];
    }
  | {
      [Scenario.AC]: number[];
    }
  | {
      [Scenario.FC]: number[];
    }
  | {
      [Scenario.PL]: number[];
    };

export type DataType = SimpleDataType | ParallelDataType | StackedDataType;
