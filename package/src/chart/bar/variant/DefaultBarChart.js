import { renderChart } from '../../../render/Chart';
import { ChartType } from '../../../types/ChartType';
import { AxialDataPoint } from '../../AxialDataPoint';
import { BarAxis } from '../BarAxis';

export function DefaultBarChart(chart, finalScale) {
  const { data, width = 100, height } = chart;

  let { scale, reScale, axisOrigin } = finalScale;

  const axis = new BarAxis(axisOrigin.x, axisOrigin.y, data, scale * reScale);

  const renderRects = data.map((element, index) => {
    const column = new AxialDataPoint({
      x: axis.x,
      y: axis.dataPointPositions[index],
      dataPoint: element,
      rectWidth: BarAxis.primaryBarWidth,
      scale: scale * reScale,
      chartType: ChartType.BAR,
    });

    return column.render;
  });

  return renderChart({
    chart: renderRects + axis.render(),
    width,
    height: height ?? axis.chartWidth,
    viewBoxWidth: width * reScale,
    viewBoxHeight: axis.chartWidth,
  });
}
