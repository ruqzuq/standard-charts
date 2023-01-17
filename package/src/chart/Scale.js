import { TextDimension } from '../text/TextDimension';
import { ChartType } from '../types/ChartType';
import { DataPoint } from './Datapoint';

export class Scale {
  static chartPadding = 10;
  static barLabelGap = 10;

  static DefaultColumn(chart, totalHeight) {
    const { chartType, data } = chart;

    // second is number of key/value-labels
    let maxPrimaryValue = {
      value: 0,
      labels: [''],
    };
    let minPrimaryValue = {
      value: 0,
      labels: [
        data
          .map((dataPoint) => dataPoint.key)
          .sort(
            (a, b) => TextDimension.labelWidth(b) - TextDimension.labelWidth(a)
          )[0], // Take the widest key label for initial negative key label width.
      ],
    };

    let maxSecondaryValue = 0;
    let minSecondaryValue = 0;

    for (let i = 0; i < data.length; i++) {
      const dataPoint = data[i];
      const { left, primary, right } = DataPoint.allValues(dataPoint);

      const [leftPositiveStackValue, leftNegativeStackValue] =
        DataPoint.stackValues(left);

      const [rightPositiveStackValue, rightNegativeStackValue] =
        DataPoint.stackValues(right);

      [leftPositiveStackValue, rightPositiveStackValue].forEach(
        (positiveStackValue) => {
          if (positiveStackValue > maxSecondaryValue) {
            maxSecondaryValue = positiveStackValue;
          }
        }
      );

      [leftNegativeStackValue, rightNegativeStackValue].forEach(
        (negativeStackValue) => {
          if (negativeStackValue < minSecondaryValue) {
            minSecondaryValue = negativeStackValue;
          }
        }
      );

      const [primaryPositiveStackValue, primaryNegativeStackValue] =
        DataPoint.stackValues(primary);

      if (primaryPositiveStackValue > maxPrimaryValue.value) {
        maxPrimaryValue = {
          value: primaryPositiveStackValue,
          labels: [primaryPositiveStackValue],
        }; // `value` label.
      }
      if (primaryNegativeStackValue < minPrimaryValue.value) {
        minPrimaryValue = {
          value: primaryNegativeStackValue,
          labels:
            primaryPositiveStackValue === 0
              ? [primaryNegativeStackValue]
              : [dataPoint.key, primaryNegativeStackValue], // `key`, `value`/`key` label.
        };
      }
    }

    /**
     * R88 a,b
     */
    const preActualHeight = totalHeight - 2 * Scale.chartPadding; // Vertical padding

    const maxPositiveValue = Math.max(maxPrimaryValue.value, maxSecondaryValue);
    const minNegativeValue = Math.min(minPrimaryValue.value, minSecondaryValue);

    const preScale =
      preActualHeight / (maxPositiveValue + Math.abs(minNegativeValue));

    const labelOffset = (labels) =>
      chartType === ChartType.COLUMN
        ? labels.length * TextDimension.labelHeight
        : labels.reduce(
            (accumulator, currentValue, currentIndex) =>
              accumulator +
              TextDimension.labelWidth(currentValue) +
              (currentIndex > 0 ? Scale.barLabelGap : 0),
            0
          );

    const calcLabelOverflow = (primaryValue, secondaryValue) =>
      Math.abs(primaryValue.value) >= Math.abs(secondaryValue)
        ? labelOffset(primaryValue.labels)
        : Math.max(
            0,
            Math.abs(primaryValue.value) * preScale +
              labelOffset(primaryValue.labels) -
              Math.abs(secondaryValue) * preScale
          );

    const maxOverflow = calcLabelOverflow(maxPrimaryValue, maxSecondaryValue);
    const minOverflow = calcLabelOverflow(minPrimaryValue, minSecondaryValue);

    const finalScale =
      ((maxPositiveValue + Math.abs(minNegativeValue)) * preScale -
        (maxOverflow + minOverflow)) /
      (maxPositiveValue + Math.abs(minNegativeValue));

    const finalActualHeight =
      maxPositiveValue * finalScale + Math.abs(minNegativeValue * finalScale);

    return {
      scale: finalScale,
      heights: {
        actualHeight: finalActualHeight,
        maxPositiveValue,
        minNegativeValue,
      },
      axisOrigin: {
        x:
          Scale.chartPadding +
          (chartType === ChartType.BAR
            ? minOverflow + Math.abs(minNegativeValue) * finalScale
            : 0),
        y:
          Scale.chartPadding +
          (chartType === ChartType.COLUMN
            ? maxOverflow + maxPositiveValue * finalScale
            : 0),
      },
    };
  }

  static StackColumn(chart, totalHeight) {
    return Scale.DefaultColumn(chart, totalHeight);
  }

  static DefaultBar(chart, totalHeight) {
    return Scale.DefaultColumn(chart, totalHeight);
  }
}
