import { renderChart } from '../../../render/Chart';
import { ChartType } from '../../../types/ChartType';
import { AxialDataPoint } from '../../AxialDataPoint';
import { ColumnAxis } from '../ColumnAxis';

export function DefaultColumnChart(chart, finalScale) {
  const { data, height = 100, width } = chart;

  const { scale, reScale, axisOrigin } = finalScale;

  const axis = new ColumnAxis(
    axisOrigin.x,
    axisOrigin.y,
    data,
    scale * reScale
  );

  const renderRects = data.map((element, index) => {
    const column = new AxialDataPoint({
      x: axis.dataPointPositions[index],
      y: axis.y,
      dataPoint: element,
      rectWidth: axis.columnWidth,
      scale: scale * reScale,
      chartType: ChartType.COLUMN,
    });

    return column.render;
  });

  return renderChart({
    chart: renderRects + axis.render(),
    width: width ?? axis.chartWidth,
    height,
    viewBoxWidth: axis.chartWidth,
    viewBoxHeight: height * reScale,
  });
}
