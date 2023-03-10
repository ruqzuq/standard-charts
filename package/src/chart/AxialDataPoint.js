import { renderText } from '../render/Text';
import { TextDimension } from '../text/TextDimension';
import { ChartType } from '../types/ChartType';
import { AxialRect, Direction } from './AxialRect';
import { BarAxis } from './bar/BarAxis';
import { ColumnAxis } from './column/ColumnAxis';
import { DataPoint } from './Datapoint';
import { Representation } from './Representation';
import { Scale } from './Scale';

export class AxialDataPoint {
  constructor(props) {
    const { x, y, dataPoint, rectWidth, scale, stack, chartType } = props;

    const { left, primary, right } = DataPoint.allValues(dataPoint);

    const [leftPositiveStack, leftNegativeStack] =
      AxialDataPoint.buildMetaDataPoints({
        ...props,
        metaDataPoints: left,
        axisOffset:
          chartType === ChartType.COLUMN
            ? -ColumnAxis.secondaryColumnWidth
            : -BarAxis.secondaryBarWidth,
        chartType,
      });
    const [rightPositiveStack, rightNegativeStack] =
      AxialDataPoint.buildMetaDataPoints({
        ...props,
        metaDataPoints: right,
        axisOffset:
          chartType === ChartType.COLUMN
            ? ColumnAxis.secondaryColumnWidth
            : BarAxis.secondaryBarWidth,
        chartType,
      });
    const [primaryPositiveStack, primaryNegativeStack] =
      AxialDataPoint.buildMetaDataPoints({
        ...props,
        metaDataPoints: primary,
        primary: true,
        chartType,
      });

    const [allRects, allLabels] = [
      ...leftPositiveStack,
      ...leftNegativeStack,
      ...rightPositiveStack,
      ...rightNegativeStack,
      ...primaryPositiveStack,
      ...primaryNegativeStack,
    ]
      .map((rect) =>
        Representation.renderAxialRectByScenario({ ...rect, stack })
      )
      .reduce(
        (accumulator, currentValue) => [
          accumulator[0].concat(currentValue[0]),
          accumulator[1].concat(currentValue[1]),
        ],
        [[], []]
      );

    const lastPrimaryPositive =
      primaryPositiveStack[primaryPositiveStack.length - 1];
    const firstPrimaryPositive = primaryPositiveStack[0];
    const lastPrimaryNegative =
      primaryNegativeStack[primaryNegativeStack.length - 1];
    const firstPrimaryNegative = primaryNegativeStack[0];

    const [primaryPositiveStackValue, primaryNegativeStackValue] =
      DataPoint.stackValues(primary);

    // Labeling on positive/top side.
    if (lastPrimaryPositive) {
      const positiveValuePosition = lastPrimaryPositive.axialRect.topWord(
        primaryPositiveStackValue
      );
      allLabels.push(
        ColumnAxis.outerFit(primaryPositiveStackValue) ||
          chartType === ChartType.BAR
          ? renderText({
              word: primaryPositiveStackValue,
              x: positiveValuePosition.x,
              y: positiveValuePosition.y,
              background: 'white',
            })
          : ''
      );
      if (!lastPrimaryNegative) {
        const positiveKeyPosition = firstPrimaryPositive.axialRect.bottomWord(
          dataPoint.key
        );
        allLabels.push(
          ColumnAxis.outerFit(dataPoint.key) || chartType === ChartType.BAR
            ? renderText({
                word: dataPoint.key,
                x: positiveKeyPosition.x,
                y: positiveKeyPosition.y,
                background: 'white',
              })
            : ''
        );
      }
    }

    // Labeling on negative/bottom side.
    if (lastPrimaryNegative) {
      const negativeValuePosition = lastPrimaryNegative.axialRect.topWord(
        primaryNegativeStackValue
      );
      allLabels.push(
        ColumnAxis.outerFit(primaryNegativeStackValue) ||
          chartType === ChartType.BAR
          ? renderText({
              word: primaryNegativeStackValue,
              x: negativeValuePosition.x,
              y: negativeValuePosition.y,
              background: 'white',
            })
          : ''
      );
      const negativeKeyPosition = lastPrimaryPositive
        ? lastPrimaryNegative.axialRect.topWord(dataPoint.key)
        : firstPrimaryNegative.axialRect.bottomWord(dataPoint.key);
      allLabels.push(
        ColumnAxis.outerFit(dataPoint.key) || chartType === ChartType.BAR
          ? renderText({
              word: dataPoint.key,
              x:
                negativeKeyPosition.x +
                (chartType === ChartType.BAR && lastPrimaryPositive
                  ? -TextDimension.labelWidth(primaryNegativeStackValue) -
                    Scale.barLabelGap
                  : 0),
              y:
                negativeKeyPosition.y +
                (chartType === ChartType.COLUMN && lastPrimaryPositive
                  ? TextDimension.labelHeight
                  : 0),
              background: 'white',
            })
          : ''
      );
    }

    this.render = allRects + allLabels;
  }

  static buildMetaDataPoint(props) {
    const { value, x, y, rectWidth, scale, axisOffset, chartType } = props;

    const axialRect = new AxialRect(
      x + (chartType === ChartType.COLUMN ? axisOffset : 0),
      y + (chartType === ChartType.BAR ? axisOffset : 0),
      rectWidth,
      Math.abs(value * scale),
      chartType === ChartType.COLUMN
        ? value > 0
          ? Direction.TOP
          : Direction.BOTTOM
        : value > 0
        ? Direction.RIGHT
        : Direction.LEFT
    );

    return axialRect; // Top Y-Position.
  }

  static buildMetaDataPoints(props) {
    const {
      metaDataPoints,
      x,
      y,
      rectWidth,
      scale,
      axisOffset = 0,
      primary,
      chartType,
    } = props;

    const positiveStack = [];
    const negativeStack = [];

    for (let i = 0; i < metaDataPoints.length; i++) {
      const { value, scenario, stackIndex } = metaDataPoints[i];

      const lastColumn =
        value >= 0
          ? positiveStack[positiveStack.length - 1]
          : negativeStack[negativeStack.length - 1];

      (value >= 0 ? positiveStack : negativeStack).push({
        value: value + (lastColumn ? lastColumn.value : 0),
        unstackValue: value,
        scenario,
        axialRect: AxialDataPoint.buildMetaDataPoint({
          value,
          x:
            chartType === ChartType.COLUMN || !lastColumn
              ? x
              : lastColumn.axialRect.topPosition().x,
          y:
            chartType === ChartType.BAR || !lastColumn
              ? y
              : lastColumn.axialRect.topPosition().y,
          rectWidth,
          scale,
          axisOffset,
          chartType,
        }),
        stackIndex,
        primary,
      });
    }

    return [positiveStack, negativeStack];
  }
}
