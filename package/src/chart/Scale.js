import { TextDimension } from '../text/TextDimension';
import { DataPoint } from './Datapoint';

export class Scale {
  static chartPadding = 10;

  static DefaultColumn(data, totalHeight) {
    // second is number of key/value-labels
    let maxPrimaryHeight = [0, 1];
    let minPrimaryHeight = [0, 1];

    let maxSecondaryHeight = 0;
    let minSecondaryHeight = 0;

    for (let i = 0; i < data.length; i++) {
      const dataPoint = data[i];
      const { left, primary, right } = DataPoint.allValues(dataPoint);

      const [leftPositiveStackedValue, leftNegativeStackedValue] =
        DataPoint.stackValues(left);

      const [rightPositiveStackedValue, rightNegativeStackedValue] =
        DataPoint.stackValues(right);

      [leftPositiveStackedValue, rightPositiveStackedValue].forEach(
        (positiveStackedValue) => {
          if (positiveStackedValue > maxSecondaryHeight) {
            maxSecondaryHeight = positiveStackedValue;
          }
        }
      );

      [leftNegativeStackedValue, rightNegativeStackedValue].forEach(
        (negativeStackedValue) => {
          if (negativeStackedValue > maxSecondaryHeight) {
            maxSecondaryHeight = negativeStackedValue;
          }
        }
      );

      const [primaryPositiveStackedValue, primaryNegativeStackedValue] =
        DataPoint.stackValues(primary);

      if (primaryPositiveStackedValue > maxPrimaryHeight[0]) {
        maxPrimaryHeight = [primaryPositiveStackedValue, 1]; // Value label.
      }
      if (primaryNegativeStackedValue < minPrimaryHeight[0]) {
        if (primaryPositiveStackedValue === 0) {
          minPrimaryHeight = [primaryNegativeStackedValue, 1];
        } else {
          minPrimaryHeight = [primaryNegativeStackedValue, 2];
        }
      }
    }

    let actualHeight = totalHeight - 2 * Scale.chartPadding; // Vertical padding
    let positiveMargin = 0;
    let positiveHeight = 0;
    let negativeHeight = 0;

    if (maxSecondaryHeight > maxPrimaryHeight[0]) {
      positiveMargin = Math.max(
        0,
        maxPrimaryHeight[1] * TextDimension.labelHeight - maxSecondaryHeight
      );
      actualHeight -= positiveMargin;
      positiveHeight = maxSecondaryHeight;
    } else {
      positiveMargin = maxPrimaryHeight[1] * TextDimension.labelHeight;
      actualHeight -= positiveMargin;
      positiveHeight = maxPrimaryHeight[0];
    }
    if (minSecondaryHeight < minPrimaryHeight[0]) {
      actualHeight -= Math.max(
        0,
        minPrimaryHeight[1] * TextDimension.labelHeight -
          Math.abs(minSecondaryHeight)
      );
      negativeHeight = minSecondaryHeight;
    } else {
      actualHeight -= minPrimaryHeight[1] * TextDimension.labelHeight;
      negativeHeight = minPrimaryHeight[0];
    }

    const scale = actualHeight / (positiveHeight + Math.abs(negativeHeight));

    return {
      scale,
      axisOrigin: {
        x: Scale.chartPadding,
        y: Scale.chartPadding + positiveMargin + positiveHeight * scale,
      },
    };
  }

  static StackColum(data, totalHeight) {
    return Scale.DefaultColumn(data, totalHeight);
  }
}
