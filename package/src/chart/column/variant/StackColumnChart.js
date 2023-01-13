import { renderChart } from '../../../render/Chart';
import { ColumnChartVariant } from '../../../types/ChartType';
import { Column } from '../Column';
import { ColumnAxis } from '../ColumnAxis';
import { Label } from '../Label';

export function StackColumnChart(chart, finalScale) {
  const { data, height = 100 } = chart;

  const { scale, heights, axisOrigin } = finalScale;

  const axis = new ColumnAxis(
    axisOrigin.x,
    axisOrigin.y,
    data,
    scale,
    ColumnChartVariant.STACK
  );

  const { left: leftExtension, right: rightExtension } = chart;

  let leftExtensionOffset = 0;
  let rightExtensionOffset = 0;
  let renderExtensions = [];

  // For left and right.
  ['LEFT', 'RIGHT'].forEach((side) => {
    if (side === 'LEFT' ? leftExtension : rightExtension) {
      if (
        side === 'LEFT'
          ? leftExtension.extension === 'LABEL'
          : rightExtension.extension === 'LABEL'
      ) {
        const { labels } = side === 'LEFT' ? leftExtension : rightExtension;

        const labelExtension = Label.buildLabels({
          labels,
          data,
          axis,
          finalScale,
          side,
          leftExtensionOffset,
        });
        if (side === 'LEFT') {
          leftExtensionOffset = labelExtension.sideExtensionOffset;
        } else {
          rightExtensionOffset = labelExtension.sideExtensionOffset;
        }
        renderExtensions.push(labelExtension.renderLabels);
      }
    }
  });

  const renderRects = data.map((element, index) => {
    const column = new Column({
      x: axis.dataPointPositions[index] + leftExtensionOffset,
      y: axis.y,
      dataPoint: element,
      columnWidth: axis.columnWidth,
      scale,
      stack: true,
    });

    return column.render;
  });

  return renderChart({
    chart: renderRects + renderExtensions + axis.render(leftExtensionOffset),
    height,
    width: leftExtensionOffset + axis.chartWidth + rightExtensionOffset,
  });
}
