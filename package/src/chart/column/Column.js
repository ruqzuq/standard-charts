import { renderText } from '../../render/Text';
import { TextDimension } from '../../text/TextDimension';
import { AxialRect, Direction } from '../AxialRect';
import { DataPoint } from '../Datapoint';
import { HorizontalAxis } from '../HorizontalAxis';
import { Representation } from '../Representation';

export class Column {
  constructor(props) {
    const { x, y, dataPoint, columnWidth, scale, stack } = props;

    const { left, primary, right } = DataPoint.allValues(dataPoint);

    this.x = x;
    this.y = y;
    this.dataPoint = dataPoint;
    this.columnWidth = columnWidth;
    this.scale = scale;

    const [leftPositiveStack, leftNegativeStack] = this.buildColumns(
      left,
      -HorizontalAxis.sideColumnWidth
    );
    const [rightPositiveStack, rightNegativeStack] = this.buildColumns(
      right,
      HorizontalAxis.sideColumnWidth
    );
    const [primaryPositiveStack, primaryNegativeStack] = this.buildColumns(
      primary,
      0,
      true
    );

    const [allColumns, allText] = [
      ...leftPositiveStack,
      ...leftNegativeStack,
      ...rightPositiveStack,
      ...rightNegativeStack,
      ...primaryPositiveStack,
      ...primaryNegativeStack,
    ]
      .map((column) =>
        Representation.renderAxialRectByScenario({ ...column, stack })
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
      allText.push(
        HorizontalAxis.outerFit(primaryPositiveStackValue)
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
        allText.push(
          HorizontalAxis.outerFit(dataPoint.key)
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
      allText.push(
        HorizontalAxis.outerFit(primaryNegativeStackValue)
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
      allText.push(
        HorizontalAxis.outerFit(dataPoint.key)
          ? renderText({
              word: dataPoint.key,
              x: negativeKeyPosition.x,
              y:
                negativeKeyPosition.y +
                (lastPrimaryPositive ? TextDimension.labelHeight : 0),
              background: 'white',
            })
          : ''
      );
    }

    this.render = allColumns + allText;
  }

  buildColumn(value, y, axisOffset) {
    const axialRect = new AxialRect(
      this.x + axisOffset,
      y,
      this.columnWidth,
      Math.abs(value * this.scale),
      value > 0 ? Direction.TOP : Direction.BOTTOM
    );

    return axialRect; // Top Y-Position.
  }

  buildColumns(metaDataPoints, axisOffset = 0, primary) {
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
        axialRect: this.buildColumn(
          value,
          lastColumn ? lastColumn.axialRect.topPosition().y : this.y,
          axisOffset
        ),
        stackIndex,
        primary,
      });
    }

    return [positiveStack, negativeStack];
  }
}
