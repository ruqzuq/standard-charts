import { ColumnAxis } from './column/ColumnAxis';
import { Label } from './column/Label';
import { Scale } from './Scale';

export class ReScale {
  static DefaultColumn(chart, scale) {
    const { width, data } = chart;

    if (!width) {
      return 1;
    }

    const axis = new ColumnAxis(Scale.chartPadding, 0, data, scale);

    const reScale = axis.chartWidth / width;

    return reScale;
  }

  static StackColumn(chart, scale, actualHeight) {
    const { width, data, left: leftExtension, right: rightExtension } = chart;

    if (!width) {
      return 1;
    }

    const axis = new ColumnAxis(Scale.chartPadding, 0, data, scale);

    let leftExtensionOffset = 0;
    let rightExtensionOffset = 0;

    // For left and right.
    ['LEFT', 'RIGHT'].forEach((side) => {
      if (side === 'LEFT' ? leftExtension : rightExtension) {
        if (
          side === 'LEFT'
            ? leftExtension.extension === 'LABEL'
            : rightExtension.extension === 'LABEL'
        ) {
          const { labels } = side === 'LEFT' ? leftExtension : rightExtension;

          const sideExtensionOffset = Label.calculateSideExtensionOffset(
            labels,
            actualHeight
          );

          if (side === 'LEFT') {
            leftExtensionOffset = sideExtensionOffset;
          } else {
            rightExtensionOffset = sideExtensionOffset;
          }
        }
      }
    });

    const reScale =
      (leftExtensionOffset + axis.chartWidth + rightExtensionOffset) / width;

    return reScale;
  }
}
