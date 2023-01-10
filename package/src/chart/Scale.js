import { TextDimension } from '../text/TextDimension';
import { DataPoint } from './Datapoint';

export class Scale {
  static chartPadding = 10;

  static DefaultColumn(data, totalHeight) {
    // second is number of key/value-labels
    let maxPrimaryValue = [0, 1];
    let minPrimaryValue = [0, 1];

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

      if (primaryPositiveStackValue > maxPrimaryValue[0]) {
        maxPrimaryValue = [primaryPositiveStackValue, 1]; // Value label.
      }
      if (primaryNegativeStackValue < minPrimaryValue[0]) {
        if (primaryPositiveStackValue === 0) {
          minPrimaryValue = [primaryNegativeStackValue, 1];
        } else {
          minPrimaryValue = [primaryNegativeStackValue, 2];
        }
      }
    }

    let actualHeight = totalHeight - 2 * Scale.chartPadding; // Vertical padding
    let positiveMargin = 0;
    let maxPositiveValue = 0;
    let minNegativeValue = 0;

    if (maxSecondaryValue > maxPrimaryValue[0]) {
      positiveMargin = Math.max(
        0,
        maxPrimaryValue[1] * TextDimension.labelHeight - maxSecondaryValue
      );
      actualHeight -= positiveMargin;
      maxPositiveValue = maxSecondaryValue;
    } else {
      positiveMargin = maxPrimaryValue[1] * TextDimension.labelHeight;
      actualHeight -= positiveMargin;
      maxPositiveValue = maxPrimaryValue[0];
    }
    if (minSecondaryValue < minPrimaryValue[0]) {
      actualHeight -= Math.max(
        0,
        minPrimaryValue[1] * TextDimension.labelHeight -
          Math.abs(minSecondaryValue)
      );
      minNegativeValue = minSecondaryValue;
    } else {
      actualHeight -= minPrimaryValue[1] * TextDimension.labelHeight;
      minNegativeValue = minPrimaryValue[0];
    }

    const scale =
      actualHeight / (maxPositiveValue + Math.abs(minNegativeValue));

    return {
      scale,
      heights: {
        actualHeight,
        maxPositiveValue,
        minNegativeValue,
      },
      axisOrigin: {
        x: Scale.chartPadding,
        y: Scale.chartPadding + positiveMargin + maxPositiveValue * scale,
      },
    };
  }

  static StackColum(data, totalHeight) {
    return Scale.DefaultColumn(data, totalHeight);
  }
}
