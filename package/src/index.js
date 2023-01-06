import { DefaultColumnChart } from './chart/column/DefaultColumnChart';
import { StackColumnChart } from './chart/column/StackColumnChart';
import { Scale } from './chart/Scale';
import { ChartType, ColumnChartVariant } from './types/ChartType';

export default function StandardCharts(charts) {
  if (!Array.isArray(charts)) {
    charts = [charts];
  }

  let scales = [];
  let minScale = Number.MAX_VALUE;

  for (let i = 0; i < charts.length; i++) {
    const { chartType, chartVariant, data, height } = charts[i];
    switch (chartType) {
      case ChartType.COLUMN:
        switch (chartVariant) {
          case ColumnChartVariant.STACK:
            scales.push(Scale.StackColum(data, height));
            break;
          default:
            scales.push(Scale.DefaultColumn(data, height));
        }
        break;
    }

    if (scales[i].scale < minScale) {
      minScale = scales[i].scale;
    }
  }

  let renderedCharts = [];

  for (let i = 0; i < charts.length; i++) {
    const chart = charts[i];
    const { chartType, chartVariant } = chart;

    const scale = scales[i];

    switch (chartType) {
      case ChartType.COLUMN:
        switch (chartVariant) {
          case ColumnChartVariant.STACK:
            renderedCharts.push(
              StackColumnChart(chart, {
                scale: minScale,
                axisOrigin: scale.axisOrigin,
              })
            );
            break;
          default:
            renderedCharts.push(
              DefaultColumnChart(chart, {
                scale: minScale,
                axisOrigin: scale.axisOrigin,
              })
            );
        }
        break;
    }
  }

  return renderedCharts;
}
