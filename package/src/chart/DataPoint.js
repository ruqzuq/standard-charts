import { Scenario } from '../types/Scenario';

export class DataPoint {
  /**
   * R40A?
   *
   * @param {*} metaDataPoints
   * @returns {[number, number]} [positiveStackValue, negativeStackValue]
   */
  static stackValues(metaDataPoints) {
    let positiveStackValue = 0;
    let negativeStackValue = 0;

    for (let i = 0; i < metaDataPoints.length; i++) {
      const value = metaDataPoints[i].value;
      if (value > 0) {
        positiveStackValue += value;
      }
      if (value < 0) {
        negativeStackValue += value;
      }
    }

    // Javascript calculations are inaccurate and more than 4 digits are unnecessary.
    positiveStackValue = Math.round(positiveStackValue * 1000) / 1000;
    negativeStackValue = Math.round(negativeStackValue * 1000) / 1000;

    return [positiveStackValue, negativeStackValue];
  }

  /**
   * R40A
   *
   * @param {*} dataPoint
   * @returns {[{scenario: "FC" | "AC" | "PL" | "PY", value: number, stackIndex: number}]}
   */
  static allValues(dataPoint) {
    const { PY, AC, FC, PL } = dataPoint;

    const left = [];
    const primary = [];
    const right = [];

    const makeMetaDataPoints = (scenario) => {
      const values = dataPoint[scenario];

      return (Array.isArray(values) ? values : [values]).map(
        (value, index) => ({
          value,
          scenario,
          stackIndex: index,
        })
      );
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
  }
}
