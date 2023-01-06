import { renderChart } from '../../render/Chart';
import { HorizontalAxis } from '../HorizontalAxis';
import { Column } from './Column';

export function DefaultColumnChart(chart, minScale) {
  const { data, height = 100 } = chart;

  const { scale, axisOrigin } = minScale;

  const axis = new HorizontalAxis(axisOrigin.x, axisOrigin.y, data);

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
