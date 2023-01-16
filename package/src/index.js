import { DefaultBarChart } from './chart/bar/variant/DefaultBarChart';
import { DefaultColumnChart } from './chart/column/variant/DefaultColumnChart';
import { StackColumnChart } from './chart/column/variant/StackColumnChart';
import { ReScale } from './chart/ReScale';
import { Scale } from './chart/Scale';
import { ChartType, ColumnChartVariant } from './types/ChartType';

export default function StandardCharts(charts) {
  if (!Array.isArray(charts)) {
    charts = [charts];
  }

  let scales = [];
  let minScale = Number.MAX_VALUE;

  for (let i = 0; i < charts.length; i++) {
    const { chartType, chartVariant, data, height, width } = charts[i];

    let scale = { scale: 1, heights: { actualHeight: height } };

    let oldRescale = 0;
    let reScale = 1;

    while (oldRescale != reScale) {
      oldRescale = reScale;
      switch (chartType) {
        case ChartType.COLUMN:
          switch (chartVariant) {
            case ColumnChartVariant.STACK:
              reScale = ReScale.StackColumn(
                charts[i],
                scale.scale * reScale,
                scale.heights.actualHeight
              );
              scale = Scale.StackColumn(charts[i], height * reScale);
              break;
            default:
              reScale = ReScale.DefaultColumn(charts[i], scale.scale * reScale);
              scale = Scale.DefaultColumn(charts[i], height * reScale);
          }
          break;
        case ChartType.BAR:
          switch (chartVariant) {
            default:
              reScale = ReScale.DefaultBar(charts[i], scale.scale * reScale);
              scale = Scale.DefaultBar(charts[i], width * reScale);
          }
          break;
      }
      console.log('ITERATION', oldRescale, reScale);
    }

    console.log('finished');

    scale.reScale = reScale;
    scales.push(scale);

    if (scales[i].scale / reScale < minScale) {
      minScale = scales[i].scale / reScale;
    }
  }

  let renderedCharts = [];

  for (let i = 0; i < charts.length; i++) {
    const chart = charts[i];
    const { chartType, chartVariant } = chart;

    const chartSpecificScale = scales[i];

    switch (chartType) {
      case ChartType.COLUMN:
        switch (chartVariant) {
          case ColumnChartVariant.STACK:
            renderedCharts.push(
              StackColumnChart(chart, {
                ...chartSpecificScale,
                scale: minScale,
              })
            );
            break;
          default:
            renderedCharts.push(
              DefaultColumnChart(chart, {
                ...chartSpecificScale,
                scale: minScale,
              })
            );
        }
        break;
      case ChartType.BAR:
        switch (chartVariant) {
          default:
            renderedCharts.push(
              DefaultBarChart(chart, {
                ...chartSpecificScale,
                scale: minScale,
              })
            );
        }
        break;
    }
  }

  return renderedCharts;
}
