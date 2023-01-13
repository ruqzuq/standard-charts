import { renderChart } from '../../../render/Chart';
import { Column } from '../Column';
import { ColumnAxis } from '../ColumnAxis';

export function DefaultColumnChart(chart, finalScale) {
  const { data, height = 100 } = chart;

  const { scale, axisOrigin } = finalScale;

  const axis = new ColumnAxis(axisOrigin.x, axisOrigin.y, data, scale);

  const renderRects = data.map((element, index) => {
    const column = new Column({
      x: axis.dataPointPositions[index],
      y: axis.y,
      dataPoint: element,
      columnWidth: axis.columnWidth,
      scale: scale,
    });

    return column.render;
  });

  return renderChart({
    chart: renderRects + axis.render(),
    height,
    width: axis.chartWidth,
  });
}
