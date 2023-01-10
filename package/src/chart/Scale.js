import { TextDimension } from '../text/TextDimension';
import { DataPoint } from './Datapoint';

export class Scale {
  static chartPadding = 10;

  static DefaultColumn(data, totalHeight) {
    // second is number of key/value-labels
    let maxPrimaryValue = {
      value: 0,
      labels: 1,
    };
    let minPrimaryValue = {
      value: 0,
      labels: 1,
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
          labels: 1,
        }; // `value` label.
      }
      if (primaryNegativeStackValue < minPrimaryValue.value) {
        minPrimaryValue = {
          value: primaryNegativeStackValue,
          labels: primaryPositiveStackValue === 0 ? 1 : 2, // `key`, `value`/`key` label.
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

    const calcLabelOverflow = (primaryValue, secondaryValue) =>
      Math.abs(primaryValue.value) >= Math.abs(secondaryValue)
        ? primaryValue.labels * TextDimension.labelHeight
        : Math.max(
            0,
            Math.abs(primaryValue.value) * preScale +
              primaryValue.labels * TextDimension.labelHeight -
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
        x: Scale.chartPadding,
        y: Scale.chartPadding + maxOverflow + maxPositiveValue * finalScale,
      },
    };
  }

  static StackColum(data, totalHeight) {
    return Scale.DefaultColumn(data, totalHeight);
  }
}
