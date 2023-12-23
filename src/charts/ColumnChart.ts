import { ChartTypes } from '..';
import { Box } from '../base/Box';
import { extractParallelValues } from '../base/Data';
import { ParallelDataType } from '../base/DataTypes';
import { MaxMeasure } from '../base/MaxMeasure';
import { Rect } from '../base/Rect';
import { Text } from '../base/Text';
import { Chart, ChartProps } from './Chart';
import { Constants } from './Constants';

export interface ColumnChartProps extends ChartProps<ParallelDataType> {
  chartType: ChartTypes.Column;
}

export class ColumnChart extends Chart<ParallelDataType> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  axisOffset: number;

  columnWidth: number;
  columnMargin: number;
  axisElementWidth: number;

  fontSize: number;

  constructor(props: ColumnChartProps) {
    super(props);

    this.fontSize = 8;
    [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32].forEach((fontSize) => {
      if (!this.fontTooBig(fontSize)) {
        this.fontSize = fontSize;
      }
    });

    this.axisElementWidth =
      (this.width - 2 * Constants.ChartPadding) / this.data.length;

    this.columnWidth =
      (Constants.ColumnMarginToWidthRelation * this.axisElementWidth) /
      (Constants.ColumnMarginToWidthRelation + 2);
    this.columnMargin =
      this.columnWidth / Constants.ColumnMarginToWidthRelation;
  }

  fontTooBig(fontSize: number) {
    const maxTextWidth = new MaxMeasure();

    this.data.forEach(({ key, AC, PY, FC, PL }) => {
      const value = AC ?? PY ?? FC ?? PL ?? '?';

      const keyText = new Text(this.context, key, { size: fontSize });

      if (!(value === '?')) {
        const valueText = new Text(this.context, value, { size: fontSize });
        maxTextWidth.addEntry(valueText.boxWidth + 2 * Constants.ColumnPadding);
      }

      maxTextWidth.addEntry(keyText.boxWidth);
    });

    return (
      this.data.length *
        (maxTextWidth.max +
          2 * (maxTextWidth.max / Constants.ColumnMarginToWidthRelation)) >
      this.width - 2 * Constants.ChartPadding
    );
  }

  scaleTooBig(scale: number) {
    const negativeMax = new MaxMeasure();
    const positiveMax = new MaxMeasure();

    this.data.forEach((dataPoint) => {
      const { left, primary, right } = extractParallelValues(dataPoint);

      const keyText = new Text(this.context, dataPoint.key, {
        size: this.fontSize,
      });

      const { positiveStackValue, negativeStackValue } = primary;

      const positiveValueText = new Text(this.context, positiveStackValue, {
        size: this.fontSize,
      });
      const negativeValueText = new Text(this.context, negativeStackValue, {
        size: this.fontSize,
      });

      if (primary.positiveStackValue && primary.negativeStackValue) {
        negativeMax.addEntry(
          scale * Math.abs(negativeStackValue),
          negativeValueText.boxHeight,
          keyText.boxHeight
        );
        positiveMax.addEntry(
          scale * positiveStackValue,
          positiveValueText.boxHeight
        );
      } else if (positiveStackValue) {
        negativeMax.addEntry(keyText.boxHeight);
        positiveMax.addEntry(
          scale * positiveStackValue,
          positiveValueText.boxHeight
        );
      } else if (negativeStackValue) {
        negativeMax.addEntry(
          scale * Math.abs(negativeStackValue),
          negativeValueText.boxHeight
        );
        positiveMax.addEntry(keyText.boxHeight);
      }

      [left, right].forEach(({ value }) => {
        if (value) {
          if (value >= 0) {
            positiveMax.addEntry(scale * value);
          } else {
            negativeMax.addEntry(scale * Math.abs(value));
          }
        }
      });
    });

    // annahme, dass scaling präziser wird
    this.axisOffset = this.height - Constants.ChartPadding - negativeMax.max;

    return (
      negativeMax.max + positiveMax.max >
      this.height - 2 * Constants.ChartPadding
    );
  }

  draw(scale: number) {
    this.drawDebug();

    this.data.forEach((dataPoint, index) => {
      const { left, primary, right } = extractParallelValues(dataPoint);

      const origin = new Box(
        {
          x:
            Constants.ChartPadding +
            (this.columnMargin + this.columnWidth / 2) +
            index * this.axisElementWidth,
          y: this.axisOffset,
        },
        this.axisElementWidth,
        0
      );

      const keyText = new Text(this.context, dataPoint.key, {
        size: this.fontSize,
      });

      let positiveAnchor = origin;
      let negativeAnchor = origin;

      primary.values.forEach(({ value, scenario }) => {
        let valueBox;
        if (value >= 0) {
          valueBox = Box.fromTopMiddle(
            positiveAnchor,
            this.columnWidth,
            scale * value
          );
          positiveAnchor = valueBox;
        } else {
          valueBox = Box.fromBottomMiddle(
            negativeAnchor,
            this.columnWidth,
            scale * Math.abs(value)
          );
          negativeAnchor = valueBox;
        }
        Rect.draw(this.context, valueBox, scenario);
      });

      const { positiveStackValue, negativeStackValue } = primary;

      const positiveValueText = new Text(this.context, positiveStackValue, {
        size: this.fontSize,
      });
      const negativeValueText = new Text(this.context, negativeStackValue, {
        size: this.fontSize,
      });

      if (positiveStackValue && negativeStackValue) {
        positiveValueText.placeTopMiddle(positiveAnchor);
        negativeValueText.placeBottomMiddle(negativeAnchor);
        keyText.placeBottomMiddle(negativeValueText.box);
        //
        positiveValueText.draw(this.context, this.debug);
        negativeValueText.draw(this.context, this.debug);
      } else if (positiveStackValue) {
        positiveValueText.placeTopMiddle(positiveAnchor);
        keyText.placeBottomMiddle(origin);
        //
        positiveValueText.draw(this.context, this.debug);
      } else if (negativeStackValue) {
        negativeValueText.placeBottomMiddle(negativeAnchor);
        keyText.placeTopMiddle(origin);
        //
        negativeValueText.draw(this.context, this.debug);
      }
      keyText.draw(this.context, this.debug);

      // Axis
      this.context.lineWidth = 2;
      this.context.strokeStyle = '#494949';
      this.context.strokeRect(
        origin.drawX(),
        origin.drawY(),
        origin.width,
        origin.height
      );
    });
  }
}
