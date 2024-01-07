import { ChartTypes } from '../..';
import { ColumnAxis } from '../../base/Axis';
import { Box } from '../../base/Box';
import { Scenario, extractParallelValues } from '../../base/Data';
import { ParallelDataType } from '../../base/DataTypes';
import { Rect } from '../../base/Rect';
import { Text } from '../../base/Text';
import { round } from '../../base/utils/Math';
import { MaxMeasure } from '../../base/utils/MaxMeasure';
import { Chart, ChartProps } from '../Chart';
import { Constants } from '../Constants';
import { SideExtension, SideExtensionProps } from './SideExtension';
import { VarianceColumnChart } from './VarianceColumnChart';

export interface ColumnChartProps extends ChartProps<ParallelDataType> {
  chartType: ChartTypes.Column;
  top?: VarianceTopExtension[];
  left?: SideExtensionProps;
  right?: SideExtensionProps;
}

export interface VarianceTopExtension {
  variance: 'ABSOLUTE' | 'RELATIVE';
  delta: Scenario.PY | Scenario.PL;
}

export class ColumnChart extends Chart<ParallelDataType> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  axisWidth: number;
  axisOrigin: number;
  axisExtensionOffset: number = 0;

  columnWidth: number;
  columnMargin: number;
  axisElementWidth: number;

  fontSize: number;

  secondaryLeft: boolean;
  secondaryRight: boolean;

  //
  topVarianceCharts: VarianceColumnChart[] = [];
  //
  leftSideExtension: SideExtension;
  rightSideExtension: SideExtension;

  constructor(props: ColumnChartProps) {
    super(props);
    const { top, left, right } = props;

    if (left)
      this.leftSideExtension = new SideExtension(left, this.context, true);
    if (right)
      this.rightSideExtension = new SideExtension(right, this.context, false);

    this.fontSize = 8;
    [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32].forEach((fontSize) => {
      if (!this.fontTooBig(fontSize)) this.fontSize = fontSize;
    });

    if (left) {
      this.leftSideExtension.fontSize = this.fontSize;
      this.leftSideExtension.width = this.leftSideExtension.fontToWidth(
        this.fontSize
      );
    }
    if (right) {
      this.rightSideExtension.fontSize = this.fontSize;
      this.rightSideExtension.width = this.rightSideExtension.fontToWidth(
        this.fontSize
      );
    }

    this.secondaryLeft = this.data.some(
      (dataPoint) => extractParallelValues(dataPoint).left.value
    );
    this.secondaryRight = this.data.some(
      (dataPoint) => extractParallelValues(dataPoint).right.value
    );

    this.axisExtensionOffset = this.leftSideExtension?.width ?? 0;

    this.axisWidth =
      this.width -
      this.axisExtensionOffset -
      (this.rightSideExtension?.width ?? 0) -
      2 * Constants.ChartPadding;

    this.axisElementWidth = this.axisWidth / this.data.length;

    this.columnWidth =
      Constants.ColumnToWidthRelation * this.axisElementWidth -
      (this.secondaryLeft
        ? Constants.SecondaryColumnToWidthRelation * this.axisElementWidth
        : 0) -
      (this.secondaryRight
        ? Constants.SecondaryColumnToWidthRelation * this.axisElementWidth
        : 0);
    this.columnMargin =
      Constants.ColumnMarginToWidthRelation * this.axisElementWidth;

    if (top) {
      top.forEach((extension) => {
        this.topExtension(extension);
      });
    }
  }

  fontTooBig(fontSize: number) {
    const maxTextWidth = new MaxMeasure();

    this.data.forEach((dataPoint) => {
      const { positiveStackValue, negativeStackValue } =
        extractParallelValues(dataPoint).primary;

      const keyText = new Text(this.context, dataPoint.key, { size: fontSize });
      const positiveStackValueText = new Text(
        this.context,
        positiveStackValue,
        { size: fontSize }
      );
      const negativeStackValueText = new Text(
        this.context,
        negativeStackValue,
        { size: fontSize }
      );

      if (positiveStackValue) {
        maxTextWidth.addEntry(
          positiveStackValueText.boxWidth + 2 * Constants.ColumnPadding
        );
      }
      if (negativeStackValue) {
        maxTextWidth.addEntry(
          negativeStackValueText.boxWidth + 2 * Constants.ColumnPadding
        );
      }

      maxTextWidth.addEntry(keyText.boxWidth);
    });

    const elementWidth = maxTextWidth.max / Constants.ColumnToWidthRelation;

    return (
      this.data.length * elementWidth +
        (this.leftSideExtension?.fontToWidth(fontSize) ?? 0) +
        (this.rightSideExtension?.fontToWidth(fontSize) ?? 0) >
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

    // Side-extensions
    [this.leftSideExtension, this.rightSideExtension].forEach((extension) => {
      if (extension) {
        const extensionHeight = this.leftSideExtension.scaleToHeight(scale);
        if (extensionHeight > 0) {
          positiveMax.addEntry(extensionHeight);
        } else {
          negativeMax.addEntry(Math.abs(extensionHeight));
        }
      }
    });

    //
    let topExtensionHeight = 0;
    this.topVarianceCharts.forEach((chart) => {
      chart.chartOffset = topExtensionHeight;
      const varianceHeight = chart.scaleToHeight(scale);
      chart.height = varianceHeight;
      topExtensionHeight += varianceHeight;
    });

    //

    this.chartOffset = topExtensionHeight;

    // annahme, dass scaling präziser wird
    this.axisOrigin = this.height - Constants.ChartPadding - negativeMax.max;

    const height =
      negativeMax.max + positiveMax.max + 2 * Constants.ChartPadding;

    return topExtensionHeight + height > this.height;
  }

  draw(scale: number) {
    //
    this.topVarianceCharts.forEach((chart) => {
      chart.draw(scale);
    });
    //

    this.drawDebug();

    this.data.forEach((dataPoint, index) => {
      const { left, primary, right } = extractParallelValues(dataPoint);

      const origin = new Box(
        {
          x:
            Constants.ChartPadding +
            this.axisExtensionOffset +
            (this.columnMargin + this.columnWidth / 2) +
            (this.secondaryLeft
              ? Constants.SecondaryColumnToWidthRelation * this.axisElementWidth
              : 0) +
            index * this.axisElementWidth,
          y: this.axisOrigin,
        },
        this.axisElementWidth,
        0
      );

      [left, right].forEach(({ value, scenario }, index) => {
        const secondaryOrigin = new Box(
          {
            x:
              origin.x +
              (index === 0 ? -1 : 1) *
                Constants.SecondaryColumnToWidthRelation *
                this.axisElementWidth,
            y: origin.y,
          },
          0,
          0
        );
        let valueBox;
        if (value) {
          if (value >= 0) {
            valueBox = Box.fromTopMiddle(
              secondaryOrigin,
              this.columnWidth,
              scale * value
            );
          } else {
            valueBox = Box.fromBottomMiddle(
              secondaryOrigin,
              this.columnWidth,
              scale * Math.abs(value)
            );
          }
          Rect.draw(this.context, valueBox, scenario);
        }
      });

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
    });
    // Axis
    const axis = new ColumnAxis(
      {
        x: Constants.ChartPadding + this.axisExtensionOffset,
        y: this.axisOrigin,
      },
      this.axisWidth
    );
    axis.draw(this.context);
    // Side extensions
    this.leftSideExtension?.draw(scale, this.axisOrigin, this.axisWidth);
    this.rightSideExtension?.draw(scale, this.axisOrigin, this.axisWidth);
  }

  topExtension(extension: VarianceTopExtension) {
    const varianceChart = new VarianceColumnChart({
      chartType: ChartTypes.VarianceColumn,
      variance: extension.variance,
      height: 0,
      width: this.axisWidth,
      data: this.data.map((dataPoint) => {
        const { PY, AC, FC, PL } = dataPoint;

        const value = AC || FC ? (AC ?? 0) + (FC ?? 0) : undefined;
        const comparison =
          extension.delta === Scenario.PY ? PY ?? undefined : PL ?? undefined;

        const deviation =
          value && comparison ? round(value - comparison, 2) : undefined;

        if (FC) {
          return {
            key: dataPoint.key,
            [Scenario.FC]: deviation,
          };
        } else {
          return {
            key: dataPoint.key,
            [Scenario.AC]: deviation,
          };
        }
      }),
      axis: extension.delta,
      debug: this.debug,
    });
    varianceChart.axisWidth = this.axisWidth;
    varianceChart.axisElementWidth = this.axisElementWidth;
    varianceChart.columnWidth = this.columnWidth;
    varianceChart.columnMargin = this.columnMargin;
    varianceChart.secondaryLeftOffset = this.secondaryLeft
      ? Constants.SecondaryColumnToWidthRelation * this.axisElementWidth
      : 0;
    varianceChart.canvas = this.canvas;
    varianceChart.context = this.context;
    varianceChart.fontSize = this.fontSize;
    varianceChart.isExtension = true;
    varianceChart.axisExtensionOffset = this.axisExtensionOffset;

    this.topVarianceCharts.push(varianceChart);
  }
}
