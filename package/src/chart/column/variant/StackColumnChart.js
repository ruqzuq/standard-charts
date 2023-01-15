import { renderChart } from '../../../render/Chart';
import { ChartType, ColumnChartVariant } from '../../../types/ChartType';
import { AxialDataPoint } from '../../AxialDataPoint';
import { ColumnAxis } from '../ColumnAxis';
import { Label } from '../Label';

export function StackColumnChart(chart, finalScale) {
  const { data, height = 100, width } = chart;

  const { scale, reScale, heights, axisOrigin } = finalScale;

  const axis = new ColumnAxis(
    axisOrigin.x,
    axisOrigin.y,
    data,
    scale * reScale,
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
          finalScale: { ...finalScale, scale: scale * reScale },
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
    const column = new AxialDataPoint({
      x: axis.dataPointPositions[index] + leftExtensionOffset,
      y: axis.y,
      dataPoint: element,
      rectWidth: axis.columnWidth,
      scale: scale * reScale,
      stack: true,
      chartType: ChartType.COLUMN,
    });

    return column.render;
  });

  return renderChart({
    chart: renderRects + renderExtensions + axis.render(leftExtensionOffset),
    width:
      width ?? leftExtensionOffset + axis.chartWidth + rightExtensionOffset,
    height,
    viewBoxWidth: leftExtensionOffset + axis.chartWidth + rightExtensionOffset,
    viewBoxHeight: height * reScale,
  });
}
