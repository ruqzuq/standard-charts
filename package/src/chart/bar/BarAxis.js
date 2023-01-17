import { renderRect } from '../../render/Rect';
import { TextDimension } from '../../text/TextDimension';
import { DataPoint } from '../Datapoint';
import { Scale } from '../Scale';

export class BarAxis {
  static barPadding = 1;
  static secondaryBarWidth = 6;
  static primaryBarWidth =
    TextDimension.labelHeight + 2 + 2 * BarAxis.barPadding;
  static barMargin = BarAxis.primaryBarWidth / 6;

  constructor(x, y, data, scale, chartVariant) {
    this.x = x;
    this.y = y;
    this.dataPointPositions = [];
    this.scale = scale;

    let leftBarWidth = 0;
    let rightBarWidth = 0;

    for (let i = 0; i < data.length; i++) {
      const { left, right } = DataPoint.allValues(data[i]);

      // Side values.
      if (left.length > 0) {
        leftBarWidth = BarAxis.secondaryBarWidth;
      }
      if (right.length > 0) {
        rightBarWidth = BarAxis.secondaryBarWidth;
      }
    }

    let tempAxisPosition = y; // Start position

    for (let i = 0; i < data.length; i++) {
      tempAxisPosition +=
        BarAxis.barMargin + leftBarWidth + BarAxis.primaryBarWidth / 2;

      this.dataPointPositions.push(tempAxisPosition);

      tempAxisPosition +=
        BarAxis.primaryBarWidth / 2 + rightBarWidth + BarAxis.barMargin;
    }

    this.width = tempAxisPosition - y; // Width of the axis.
    this.chartWidth = tempAxisPosition + Scale.chartPadding; // Width of the chart.
  }

  render(leftExtensionOffset = 0) {
    return renderRect({
      x: this.x - 1, // The actual axis is between the `2px`.
      y: this.y + leftExtensionOffset,
      width: 2,
      height: this.width,
      fill: 'rgb(0,0,0)',
    });
  }
}
