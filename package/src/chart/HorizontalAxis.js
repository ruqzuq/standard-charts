import { renderRect } from '../render/Rect';
import { TextDimension } from '../text/TextDimension';
import { DataPoint } from './Datapoint';
import { Scale } from './Scale';

export class HorizontalAxis {
  //static columnMargin = 4;
  static columnPadding = 1;
  static sideColumnWidth = 6;
  static minInnerColumnWidth = 22;
  static maxInnerColumnWidth = 66;

  constructor(x, y, data, scale) {
    this.x = x;
    this.y = y;
    this.dataPointPositions = [];
    this.scale = scale;

    this.leftColumnWidth = 0;
    let maxColumnWidth =
      HorizontalAxis.minInnerColumnWidth + 2 * HorizontalAxis.columnPadding;
    this.rightColumnWidth = 0;

    // Find maxColumnWidth:
    for (let i = 0; i < data.length; i++) {
      const { key } = data[i];

      const maxOuterFit = (word) => {
        if (
          HorizontalAxis.outerFit(word) &&
          TextDimension.widthOfWord(word) > maxColumnWidth
        ) {
          maxColumnWidth = TextDimension.widthOfWord(word);
        }
      };

      const { left, primary, right } = DataPoint.allValues(data[i]);

      // key
      maxOuterFit(key);
      // positive and negative values
      maxOuterFit(DataPoint.stackValues(primary)[0]);
      maxOuterFit(DataPoint.stackValues(primary)[1]);
      // Side values.
      if (left.length > 0) {
        this.leftColumnWidth = HorizontalAxis.sideColumnWidth;
      }
      if (right.length > 0) {
        this.rightColumnWidth = HorizontalAxis.sideColumnWidth;
      }
    }

    this.columnWidth = maxColumnWidth + 2 * HorizontalAxis.columnPadding;
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
      HorizontalAxis.maxInnerColumnWidth >=
        TextDimension.widthOfWord(word) + 2 &&
      rectHeight - 2 * HorizontalAxis.columnPadding >= TextDimension.totalHeight
    );
  }

  /**
   * R41
   */
  static outerFit(word) {
    word = word.toString();
    return (
      HorizontalAxis.maxInnerColumnWidth + 2 * HorizontalAxis.columnPadding >=
      TextDimension.widthOfWord(word) + 2
    );
  }

  render() {
    return renderRect({
      x: this.x,
      y: this.y - 1, // The actual axis is between the `2px`.
      width: this.width,
      height: 2,
      fill: 'rgb(0,0,0)',
    });
  }
}
