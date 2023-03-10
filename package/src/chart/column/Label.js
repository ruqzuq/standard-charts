import { renderLine } from '../../render/Line';
import { renderText } from '../../render/Text';
import { TextDimension } from '../../text/TextDimension';
import { ChartType } from '../../types/ChartType';
import { AxialDataPoint } from '../AxialDataPoint';
import { DataPoint } from '../Datapoint';
import { Scale } from '../Scale';
import { ColumnAxis } from './ColumnAxis';

export class Label {
  /**
   *
   * @param {*} props
   * @param {"LEFT" | "RIGHT"} props.side
   * @returns
   */
  static buildLabels(props) {
    const {
      labels,
      data,
      axis,
      finalScale,
      side,
      leftExtensionOffset = 0,
    } = props;
    const { scale, heights, axisOrigin } = finalScale;

    const renderLabels = [];

    // Reduce to fitting number of labels.
    while (heights.actualHeight < labels.length * TextDimension.labelHeight) {
      labels.pop();
    }
    // Chart is extended sideways.
    const sideExtensionOffset = Math.max(
      ...labels.map((label) => TextDimension.labelWidth(label))
    );

    const { left, primary, right } = DataPoint.allValues(
      side === 'LEFT' ? data[0] : data[data.length - 1]
    );

    // `metaDataPoints` to be labeled.
    const targetMetaDataPoints = [];
    let targetDataPointOffset = 0;

    if (side === 'LEFT' && left.length > 0) {
      targetMetaDataPoints.push(...left);
      targetDataPointOffset = -ColumnAxis.secondaryColumnWidth;
    } else if (side === 'RIGHT' && right.length > 0) {
      targetMetaDataPoints.push(...right);
      targetDataPointOffset = ColumnAxis.secondaryColumnWidth;
    } else {
      targetMetaDataPoints.push(...primary);
    }

    let unjustifyMetaDataPoints = targetMetaDataPoints.slice(0, labels.length);
    let justifyMetaDataPoints = targetMetaDataPoints.slice(0, labels.length);

    // Minimum guaranteed size for `TextDimension.labelHeight`.
    justifyMetaDataPoints = justifyMetaDataPoints.map(
      (justifyMetaDataPoint) => ({
        ...justifyMetaDataPoint,
        value:
          Math.max(
            Math.abs(justifyMetaDataPoint.value),
            TextDimension.labelHeight / scale
          ) * (justifyMetaDataPoint.value > 0 ? 1 : -1),
      })
    );
    // All values must fit.
    while (
      heights.actualHeight <
      justifyMetaDataPoints.reduce(
        (accumulator, currentJustifyMetaDataPoint) =>
          accumulator + Math.abs(currentJustifyMetaDataPoint.value) * scale,
        0
      )
    ) {
      justifyMetaDataPoints = justifyMetaDataPoints.map(
        (labelMetaDataPoint) => ({
          ...labelMetaDataPoint,
          value:
            Math.max(
              Math.abs(
                Math.abs(labelMetaDataPoint.value) -
                  Math.abs(labelMetaDataPoint.value / 10)
              ),
              TextDimension.labelHeight / scale
            ) * (labelMetaDataPoint.value > 0 ? 1 : -1),
        })
      );
    }

    const [positiveUnjustifyColumns, negativeUnjustifyColumns] =
      AxialDataPoint.buildMetaDataPoints({
        metaDataPoints: unjustifyMetaDataPoints,
        x:
          (side === 'LEFT'
            ? axis.dataPointPositions[0] + sideExtensionOffset
            : axis.dataPointPositions[axis.dataPointPositions.length - 1] +
              leftExtensionOffset) + targetDataPointOffset,
        y: axisOrigin.y,
        rectWidth: axis.columnWidth,
        scale,
        chartType: ChartType.COLUMN,
      });
    const unjustifyColumns = [
      ...positiveUnjustifyColumns,
      ...negativeUnjustifyColumns,
    ];

    const [positiveJustifyColumns, negativeJustifyColumns] =
      AxialDataPoint.buildMetaDataPoints({
        metaDataPoints: justifyMetaDataPoints,
        x:
          side === 'LEFT'
            ? Scale.chartPadding + sideExtensionOffset / 2
            : Scale.chartPadding +
              leftExtensionOffset +
              axis.width +
              sideExtensionOffset / 2,
        y: axisOrigin.y,
        rectWidth: sideExtensionOffset,
        scale,
        chartType: ChartType.COLUMN,
      });

    const justifyColumns = [
      ...positiveJustifyColumns,
      ...negativeJustifyColumns,
    ];

    const [positiveJustifyStackValue, negativeJustifyStackValue] =
      DataPoint.stackValues(justifyMetaDataPoints);

    const justifyColumnsOffset =
      (Math.max(0, positiveJustifyStackValue - heights.maxPositiveValue) +
        Math.min(0, negativeJustifyStackValue - heights.minNegativeValue)) *
      scale;

    justifyColumns.forEach((justifyColumn) => {
      justifyColumn.axialRect.y =
        justifyColumn.axialRect.y + justifyColumnsOffset;
    });

    justifyColumns.forEach((justifyColumn, index) => {
      const centerLabelUnjustify = unjustifyColumns[index].axialRect.centerWord(
        labels[justifyColumn.stackIndex]
      );

      // Only if `justifyColumn` covers centerWord of `unjustifyColumn`.
      const alignToUnjustifyCenter =
        centerLabelUnjustify.y - TextDimension.actualHeight >
          justifyColumn.axialRect.draw().y &&
        centerLabelUnjustify.y + TextDimension.bottomPadding <
          justifyColumn.axialRect.draw().y +
            justifyColumn.axialRect.draw().height;

      renderLabels.push(
        renderText({
          y: alignToUnjustifyCenter
            ? centerLabelUnjustify.y
            : justifyColumn.axialRect.centerWord(
                labels[justifyColumn.stackIndex]
              ).y,
          x:
            justifyColumn.axialRect.centerWord(labels[justifyColumn.stackIndex])
              .x +
            (side === 'LEFT' ? 1 : -1) *
              ((sideExtensionOffset -
                TextDimension.labelWidth([labels[justifyColumn.stackIndex]])) /
                2),
          word: labels[justifyColumn.stackIndex],
        })
      );

      if (!alignToUnjustifyCenter) {
        renderLabels.push(
          renderLine({
            startPosition:
              side === 'LEFT'
                ? unjustifyColumns[index].axialRect.leftPosition()
                : unjustifyColumns[index].axialRect.rightPosition(),
            endPosition:
              side === 'LEFT'
                ? justifyColumn.axialRect.rightPosition()
                : justifyColumn.axialRect.leftPosition(),
          })
        );
      }
    });

    return {
      sideExtensionOffset,
      renderLabels,
    };
  }

  static calculateSideExtensionOffset(labels, actualHeight) {
    // Reduce to fitting number of labels.
    while (actualHeight < labels.length * TextDimension.labelHeight) {
      labels.pop();
    }
    // Chart is extended sideways.
    return Math.max(...labels.map((label) => TextDimension.labelWidth(label)));
  }
}
