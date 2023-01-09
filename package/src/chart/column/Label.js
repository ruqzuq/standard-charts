import { renderLine } from '../../render/Line';
import { renderText } from '../../render/Text';
import { TextDimension } from '../../text/TextDimension';
import { DataPoint } from '../Datapoint';
import { Scale } from '../Scale';
import { Column } from './Column';

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

    // Values to be labeled.
    const { primary } = DataPoint.allValues(
      side === 'LEFT' ? data[0] : data[data.length - 1]
    );
    let unjustifyMetaDataPoints = primary.slice(0, labels.length);
    let justifyMetaDataPoints = primary.slice(0, labels.length);

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
      Column.buildColumns({
        metaDataPoints: unjustifyMetaDataPoints,
        x:
          side === 'LEFT'
            ? axis.dataPointPositions[0] + sideExtensionOffset
            : axis.dataPointPositions[axis.dataPointPositions.length - 1] +
              leftExtensionOffset,
        y: axisOrigin.y,
        columnWidth: axis.columnWidth,
        scale,
      });
    const unjustifyColumns = [
      ...positiveUnjustifyColumns,
      ...negativeUnjustifyColumns,
    ];

    const [positiveJustifyColumns, negativeJustifyColumns] =
      Column.buildColumns({
        metaDataPoints: justifyMetaDataPoints,
        x:
          side === 'LEFT'
            ? Scale.chartPadding + sideExtensionOffset / 2
            : Scale.chartPadding +
              leftExtensionOffset +
              axis.width +
              sideExtensionOffset / 2,
        y: axisOrigin.y,
        columnWidth: sideExtensionOffset,
        scale,
      });

    const justifyColumns = [
      ...positiveJustifyColumns,
      ...negativeJustifyColumns,
    ];

    const [positiveJustifyStackValue, negativeJustifyStackValue] =
      DataPoint.stackValues(justifyMetaDataPoints);

    const justifyColumnsOffset =
      (Math.max(0, positiveJustifyStackValue - heights.positiveHeight) +
        Math.min(0, negativeJustifyStackValue - heights.negativeHeight)) *
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
}
