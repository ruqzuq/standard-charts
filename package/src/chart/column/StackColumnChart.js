import { renderChart } from '../../render/Chart';
import { ColumnChartVariant } from '../../types/ChartType';
import { HorizontalAxis } from '../HorizontalAxis';
import { Column } from './Column';

export function StackColumnChart(chart, minScale) {
  const { data, height = 100 } = chart;

  const { scale, axisOrigin } = minScale;

  const axis = new HorizontalAxis(
    axisOrigin.x,
    axisOrigin.y,
    data,
    scale,
    ColumnChartVariant.STACK
  );

  const renderRects = data.map((element, index) => {
    const column = new Column({
      x: axis.dataPointPositions[index],
      y: axis.y,
      dataPoint: element,
      columnWidth: axis.columnWidth,
      scale: scale,
      stack: true,
    });

    return column.render;
  });

  return renderChart({
    chart: renderRects + axis.render(),
    height,
    width: axis.chartWidth,
  });
}
