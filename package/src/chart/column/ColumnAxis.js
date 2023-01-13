import { renderRect } from '../../render/Rect';
import { TextDimension } from '../../text/TextDimension';
import { ColumnChartVariant } from '../../types/ChartType';
import { DataPoint } from '../Datapoint';
import { Scale } from '../Scale';

export class ColumnAxis {
  static columnPadding = 1;
  static secondaryColumnWidth = 8;
  static minPrimaryColumnWidth = 22;
  static maxPrimaryColumnWidth = 66;

  constructor(x, y, data, scale, chartVariant) {
    this.x = x;
    this.y = y;
    this.dataPointPositions = [];
    this.scale = scale;

    this.leftColumnWidth = 0;

    let maxColumnWidth =
      ColumnAxis.minPrimaryColumnWidth + 2 * ColumnAxis.columnPadding;
    this.rightColumnWidth = 0;

    // Find maxColumnWidth:
    for (let i = 0; i < data.length; i++) {
      const { key } = data[i];

      const maxOuterFit = (word) => {
        if (
          ColumnAxis.outerFit(word) &&
          TextDimension.widthOfWord(word) > maxColumnWidth
        ) {
          maxColumnWidth = TextDimension.widthOfWord(word);
        }
      };

      const maxInnerFit = (value) => {
        if (
          ColumnAxis.innerFit(value, Math.abs(value) * scale) &&
          TextDimension.widthOfWord(value) + 2 * ColumnAxis.columnPadding >
            maxColumnWidth
        ) {
          maxColumnWidth =
            TextDimension.labelWidth(value) + 2 * ColumnAxis.columnPadding;
        }
      };

      const { left, primary, right } = DataPoint.allValues(data[i]);

      // key
      maxOuterFit(key);
      // positive and negative stack values
      maxOuterFit(DataPoint.stackValues(primary)[0]);
      maxOuterFit(DataPoint.stackValues(primary)[1]);
      // positive and negative inner values
      if (chartVariant === ColumnChartVariant.STACK) {
        primary.forEach((metaDataPoint) => maxInnerFit(metaDataPoint.value));
      }

      // Side values.
      if (left.length > 0) {
        this.leftColumnWidth = ColumnAxis.secondaryColumnWidth;
      }
      if (right.length > 0) {
        this.rightColumnWidth = ColumnAxis.secondaryColumnWidth;
      }
    }

    this.columnWidth = maxColumnWidth + 2 * ColumnAxis.columnPadding;
    this.columnMargin = maxColumnWidth / 6; // Column margin is dynamically.

    let tempAxisPosition = x; // Start position

    for (let i = 0; i < data.length; i++) {
      tempAxisPosition +=
        this.columnMargin + this.leftColumnWidth + this.columnWidth / 2;

      this.dataPointPositions.push(tempAxisPosition);

      tempAxisPosition +=
        this.columnWidth / 2 + this.rightColumnWidth + this.columnMargin;
    }

    this.width = tempAxisPosition - x; // Width of the axis.
    this.chartWidth = tempAxisPosition + Scale.chartPadding; // Width of the chart.
  }

  /**
   * R41
   */
  static innerFit(word, rectHeight) {
    word = word.toString();
    return (
      ColumnAxis.maxPrimaryColumnWidth >=
        TextDimension.labelWidth(word) + 2 * ColumnAxis.columnPadding &&
      TextDimension.totalHeight <= rectHeight - 2 * ColumnAxis.columnPadding
    );
  }

  /**
   * R41
   */
  static outerFit(word) {
    word = word.toString();
    return (
      ColumnAxis.maxPrimaryColumnWidth + 2 * ColumnAxis.columnPadding >=
      TextDimension.widthOfWord(word) + 2
    );
  }

  render(leftExtensionOffset = 0) {
    return renderRect({
      x: this.x + leftExtensionOffset,
      y: this.y - 1, // The actual axis is between the `2px`.
      width: this.width,
      height: 2,
      fill: 'rgb(0,0,0)',
    });
  }
}
