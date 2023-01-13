import { renderChart } from '../../../render/Chart';
import { ChartType } from '../../../types/ChartType';
import { AxialDataPoint } from '../../AxialDataPoint';
import { ColumnAxis } from '../ColumnAxis';

export function DefaultColumnChart(chart, finalScale) {
  const { data, height = 100 } = chart;

  const { scale, axisOrigin } = finalScale;

  const axis = new ColumnAxis(axisOrigin.x, axisOrigin.y, data, scale);

  const renderRects = data.map((element, index) => {
    const column = new AxialDataPoint({
      x: axis.dataPointPositions[index],
      y: axis.y,
      dataPoint: element,
      rectWidth: axis.columnWidth,
      scale: scale,
      chartType: ChartType.COLUMN,
    });

    return column.render;
  });

  return renderChart({
    chart: renderRects + axis.render(),
    height,
    width: axis.chartWidth,
  });
}
