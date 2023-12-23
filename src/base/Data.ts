import { DataType, ParallelDataType } from './DataTypes';

export enum Scenario {
  PY = 'PY',
  AC = 'AC',
  FC = 'FC',
  PL = 'PL',
}

export type Data<Type extends DataType> = ({ key: string } & Type)[];

export const stackValues = (metaDataPoints) => {
  let positiveStackValue = null;
  let negativeStackValue = null;

  for (let i = 0; i < metaDataPoints.length; i++) {
    const value = metaDataPoints[i].value;
    if (value >= 0) {
      if (!positiveStackValue) positiveStackValue = 0;
      positiveStackValue += value;
    }
    if (value < 0) {
      if (!negativeStackValue) negativeStackValue = 0;
      negativeStackValue += value;
    }
  }

  // Javascript calculations are inaccurate and more than 4 digits are unnecessary.
  positiveStackValue = Math.round(positiveStackValue * 1000) / 1000;
  negativeStackValue = Math.round(negativeStackValue * 1000) / 1000;

  return [positiveStackValue, negativeStackValue];
};

export type Value = { value?: number; scenario?: Scenario };

export type ParallelValues = {
  left: Value;
  primary: {
    positiveStackValue?: number;
    negativeStackValue?: number;
    values?: Value[];
  };
  right: Value;
};

export const extractParallelValues = (
  dataPoint: ParallelDataType
): ParallelValues => {
  const { PY, AC, FC, PL } = dataPoint;

  let left: Value = {};
  const primary: ParallelValues['primary'] = {};
  let right: Value = {};

  const createValue = (scenario: Scenario): Value => ({
    value: dataPoint[scenario],
    scenario,
  });

  if (AC) {
    primary.values = [createValue(Scenario.AC)];
  }
  if (FC) {
    primary.values = [...(primary.values ?? []), createValue(Scenario.FC)];
  }
  if (PL) {
    if (primary.values) {
      right = createValue(Scenario.PL);
    } else {
      primary.values = [createValue(Scenario.PL)];
    }
  }
  if (PY) {
    if (primary.values) {
      left = createValue(Scenario.PY);
    } else {
      primary.values = [createValue(Scenario.PY)];
    }
  }

  // Precalculate stacked primary values.
  primary.values.forEach(({ value }) => {
    if (value >= 0) {
      primary.positiveStackValue = (primary.positiveStackValue ?? 0) + value;
    } else {
      primary.negativeStackValue = (primary.negativeStackValue ?? 0) + value;
    }
  });

  return { left, primary, right };
};

export const extractValues = (dataPoint) => {
  const { PY, AC, FC, PL } = dataPoint;

  const left = [];
  const primary = [];
  const right = [];

  const makeMetaDataPoints = (scenario) => {
    const values = dataPoint[scenario];

    return (Array.isArray(values) ? values : [values]).map((value, index) => ({
      value,
      scenario,
      stackIndex: index,
    }));
  };

  if (AC) {
    primary.push(...makeMetaDataPoints(Scenario.AC));
  }
  if (FC) {
    primary.push(...makeMetaDataPoints(Scenario.FC));
  }
  if (PL) {
    if (primary.length === 0) {
      primary.push(...makeMetaDataPoints(Scenario.PL));
    } else {
      right.push(...makeMetaDataPoints(Scenario.PL));
    }
  }
  if (PY) {
    if (primary.length === 0) {
      primary.push(...makeMetaDataPoints(Scenario.PY));
    } else {
      left.push(...makeMetaDataPoints(Scenario.PY));
    }
  }

  return { left, right, primary };
};
