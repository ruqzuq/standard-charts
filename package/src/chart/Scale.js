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

      const [leftPositiveStackValue, leftNegativeStackValue] =
        DataPoint.stackValues(left);

      const [rightPositiveStackValue, rightNegativeStackValue] =
        DataPoint.stackValues(right);

      [leftPositiveStackValue, rightPositiveStackValue].forEach(
        (positiveStackValue) => {
          if (positiveStackValue > maxSecondaryHeight) {
            maxSecondaryHeight = positiveStackValue;
          }
        }
      );

      [leftNegativeStackValue, rightNegativeStackValue].forEach(
        (negativeStackValue) => {
          if (negativeStackValue > maxSecondaryHeight) {
            maxSecondaryHeight = negativeStackValue;
          }
        }
      );

      const [primaryPositiveStackValue, primaryNegativeStackValue] =
        DataPoint.stackValues(primary);

      if (primaryPositiveStackValue > maxPrimaryHeight[0]) {
        maxPrimaryHeight = [primaryPositiveStackValue, 1]; // Value label.
      }
      if (primaryNegativeStackValue < minPrimaryHeight[0]) {
        if (primaryPositiveStackValue === 0) {
          minPrimaryHeight = [primaryNegativeStackValue, 1];
        } else {
          minPrimaryHeight = [primaryNegativeStackValue, 2];
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
      heights: {
        actualHeight,
        positiveHeight,
        negativeHeight,
      },
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
