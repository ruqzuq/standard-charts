import { ChartTypes } from '..';
import { ColumnAxis } from '../base/Axis';
import { Box } from '../base/Box';
import { Color } from '../base/Color';
import { Scenario, extractSimpleValue } from '../base/Data';
import { SimpleDataType } from '../base/DataTypes';
import { Orientation, OrientationBox } from '../base/OrientationBox';
import { OrientationText } from '../base/OrientationText';
import { Rect } from '../base/Rect';
import { MaxMeasure } from '../base/utils/MaxMeasure';
import { Chart, ChartProps } from './Chart';
import { Constants } from './Constants';

export interface VarianceChartProps extends ChartProps<SimpleDataType> {
  chartType: ChartTypes.VarianceColumn;
  variance: 'ABSOLUTE' | 'RELATIVE';
  axis?: Scenario;
}

export class VarianceChart extends Chart<SimpleDataType> {
  axisWidth: number;
  axisOrigin: number;
  axisExtensionOffset: number = 0;

  columnWidth: number;
  columnMargin: number;
  axisElementWidth: number;
  secondaryLeftOffset: number = 0;
  axis: Scenario = Scenario.AC;

  fontSize: number;

  constructor(props: VarianceChartProps) {
    super(props);

    const { axis } = props;

    this.fontSize = 8;
    [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32].forEach((fontSize) => {
      if (!this.fontTooBig(fontSize)) {
        this.fontSize = fontSize;
      }
    });

    this.axisWidth = this.orientationWidth - 2 * Constants.ChartPadding;

    this.axisElementWidth = this.axisWidth / this.data.length;

    this.columnWidth = Constants.ColumnToWidthRelation * this.axisElementWidth;
    this.columnMargin =
      Constants.ColumnMarginToWidthRelation * this.axisElementWidth;

    if (axis) {
      this.axis = axis;
    }
  }

  fontTooBig(fontSize: number) {
    const maxTextWidth = new MaxMeasure();

    this.data.forEach((dataPoint) => {
      const { value } = extractSimpleValue(dataPoint);
      const valueText = new OrientationText(
        this.context,
        value,
        {
          size: fontSize,
        },
        this.orientation
      );

      if (value) {
        maxTextWidth.addEntry(
          valueText.orientationBoxWidth + 2 * Constants.ColumnPadding
        );
      }
    });

    const elementWidth = maxTextWidth.max / Constants.ColumnToWidthRelation;

    return (
      this.data.length * elementWidth >
      this.orientationWidth - 2 * Constants.ChartPadding
    );
  }

  scaleToHeight(scale: number, orientationHeight = this.orientationHeight) {
    const negativeMax = new MaxMeasure();
    const positiveMax = new MaxMeasure();

    this.data.forEach((dataPoint) => {
      const { value } = extractSimpleValue(dataPoint);

      if (value) {
        const valueText = new OrientationText(
          this.context,
          (value > 0 ? '+' : '-') + Math.abs(value),
          {
            size: this.fontSize,
          },
          this.orientation
        );
        if (value >= 0) {
          positiveMax.addEntry(scale * value, valueText.orientationBoxHeight);
        } else {
          negativeMax.addEntry(
            scale * Math.abs(value),
            valueText.orientationBoxHeight
          );
        }
      }
    });

    // annahme, dass scaling präziser wird
    this.axisOrigin =
      this.orientation === Orientation.Horizontal
        ? this.chartOffset + Constants.ChartPadding + positiveMax.max
        : orientationHeight -
          (this.chartOffset + Constants.ChartPadding + positiveMax.max);

    return (
      negativeMax.max +
      positiveMax.max +
      (this.isExtension ? 1 : 2) * Constants.ChartPadding
    );
  }

  scaleTooBig(scale: number) {
    return this.scaleToHeight(scale) > this.orientationHeight;
  }

  draw(scale: number) {
    this.drawDebug();

    const axis = new ColumnAxis(
      {
        x: Constants.ChartPadding + this.axisExtensionOffset,
        y: this.axisOrigin,
      },
      this.axisWidth,
      this.orientation
    );
    axis.draw(this.context, this.axis);

    this.data.forEach((dataPoint, index) => {
      const { value, scenario } = extractSimpleValue(dataPoint);

      const origin = new OrientationBox(
        new Box(
          {
            x:
              Constants.ChartPadding +
              this.axisExtensionOffset +
              (this.columnMargin + this.columnWidth / 2) +
              this.secondaryLeftOffset +
              +index * this.axisElementWidth,
            y: this.axisOrigin,
          },
          this.axisElementWidth,
          0
        ),
        this.orientation,
        true
      );

      if (value) {
        const valueText = new OrientationText(
          this.context,
          (value > 0 ? '+' : '') + value,
          {
            size: this.fontSize,
          },
          this.orientation
        );

        let valueBox;
        if (value >= 0) {
          valueBox = OrientationBox.fromNorth(
            origin,
            this.columnWidth,
            scale * value
          );
          valueText.placeNorth(valueBox);
        } else {
          valueBox = OrientationBox.fromSouth(
            origin,
            this.columnWidth,
            scale * Math.abs(value)
          );
          valueText.placeSouth(valueBox);
        }
        Rect.draw(
          this.context,
          valueBox,
          scenario,
          value >= 0 ? Color.Impact.Color.Positive : Color.Impact.Color.Negative
        );
        valueText.draw(this.context, this.debug);
      }
    });
  }
}
