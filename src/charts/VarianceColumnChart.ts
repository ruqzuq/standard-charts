import { ChartTypes } from '..';
import { Box } from '../base/Box';
import { Color } from '../base/Color';
import { Scenario, extractSimpleValue } from '../base/Data';
import { SimpleDataType } from '../base/DataTypes';
import { MaxMeasure } from '../base/MaxMeasure';
import { Rect } from '../base/Rect';
import { Text } from '../base/Text';
import { Chart, ChartProps } from './Chart';
import { Constants } from './Constants';

export interface VarianceColumnChartProps extends ChartProps<SimpleDataType> {
  chartType: ChartTypes.VarianceColumn;
  variance: 'ABSOLUTE' | 'RELATIVE';
  axis?: Scenario;
}

export class VarianceColumnChart extends Chart<SimpleDataType> {
  axisOffset: number;

  columnWidth: number;
  columnMargin: number;
  axisElementWidth: number;
  secondaryLeftOffset: number = 0;
  axis: Scenario = Scenario.AC;

  fontSize: number;

  constructor(props: VarianceColumnChartProps) {
    super(props);

    const { axis } = props;

    this.fontSize = 8;
    [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32].forEach((fontSize) => {
      if (!this.fontTooBig(fontSize)) {
        this.fontSize = fontSize;
      }
    });

    this.axisElementWidth =
      (this.width - 2 * Constants.ChartPadding) / this.data.length;

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
      const valueText = new Text(this.context, value, {
        size: fontSize,
      });

      if (value) {
        maxTextWidth.addEntry(valueText.boxWidth + 2 * Constants.ColumnPadding);
      }
    });

    const elementWidth = maxTextWidth.max / Constants.ColumnToWidthRelation;

    return (
      this.data.length * elementWidth > this.width - 2 * Constants.ChartPadding
    );
  }

  scaleToHeight(scale: number) {
    const negativeMax = new MaxMeasure();
    const positiveMax = new MaxMeasure();

    this.data.forEach((dataPoint) => {
      const { value } = extractSimpleValue(dataPoint);

      if (value) {
        const valueText = new Text(
          this.context,
          (value > 0 ? '+' : '') + value,
          {
            size: this.fontSize,
          }
        );
        if (value >= 0) {
          positiveMax.addEntry(scale * value, valueText.boxHeight);
        } else {
          negativeMax.addEntry(scale * Math.abs(value), valueText.boxHeight);
        }
      }
    });

    // annahme, dass scaling präziser wird
    this.axisOffset = Constants.ChartPadding + positiveMax.max;

    return negativeMax.max + positiveMax.max + 2 * Constants.ChartPadding;
  }

  scaleTooBig(scale: number) {
    return this.scaleToHeight(scale) > this.height;
  }

  draw(scale: number) {
    this.drawDebug();
    this.drawAxis();

    this.data.forEach((dataPoint, index) => {
      const { value, scenario } = extractSimpleValue(dataPoint);

      const origin = new Box(
        {
          x:
            Constants.ChartPadding +
            (this.columnMargin + this.columnWidth / 2) +
            this.secondaryLeftOffset +
            +index * this.axisElementWidth,
          y: this.axisOffset,
        },
        this.axisElementWidth,
        0
      );

      if (value) {
        const valueText = new Text(
          this.context,
          (value > 0 ? '+' : '') + value,
          {
            size: this.fontSize,
          }
        );

        let valueBox;
        if (value >= 0) {
          valueBox = Box.fromTopMiddle(origin, this.columnWidth, scale * value);
          valueText.placeTopMiddle(valueBox);
        } else {
          valueBox = Box.fromBottomMiddle(
            origin,
            this.columnWidth,
            scale * Math.abs(value)
          );
          valueText.placeBottomMiddle(valueBox);
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

  drawAxis() {
    if (this.axis === Scenario.PY) {
      // Axis
      this.context.fillStyle = Color.Fill.PY;
      this.context.fillRect(
        Constants.ChartPadding,
        this.axisOffset - 2,
        this.width - 2 * Constants.ChartPadding,
        4
      );
    } else if (this.axis === Scenario.FC) {
    } else if (this.axis === Scenario.PL) {
      // Axis
      this.context.fillStyle = Color.Stroke.PL;
      this.context.fillRect(
        Constants.ChartPadding,
        this.axisOffset - 2,
        this.width - 2 * Constants.ChartPadding,
        1
      );
      this.context.fillRect(
        Constants.ChartPadding,
        this.axisOffset + 1,
        this.width - 2 * Constants.ChartPadding,
        1
      );
    } else {
      // Axis
      this.context.fillStyle = '#494949';
      this.context.fillRect(
        Constants.ChartPadding,
        this.axisOffset - 1,
        this.width - 2 * Constants.ChartPadding,
        2
      );
    }
  }
}
