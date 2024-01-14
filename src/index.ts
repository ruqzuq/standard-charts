import { Text } from './base/Text';
import { ScenarioChart, ScenarioChartProps } from './charts/ScenarioChart';
import { ChartType } from './charts/Types';
import { VarianceChart, VarianceChartProps } from './charts/VarianceChart';

export type ChartProps = ScenarioChartProps | VarianceChartProps;

export type Chart = ScenarioChart | VarianceChart;

/**
 * Return URL of the rendered chart png-images.
 */
export const StandardCharts = async (charts: ChartProps[]) => {
  const chartObjects: Chart[] = [];

  charts.forEach((chart) => {
    switch (chart.type) {
      case ChartType.Scenario:
        chartObjects.push(new ScenarioChart(chart));
        break;
      case ChartType.Variance:
        chartObjects.push(new VarianceChart(chart));
        break;
    }
  });

  let scale;
  //todo improve
  let min = 0;
  let max = 10000000;

  for (let i = 0; i < 100; i++) {
    scale = min + (max - min) / 2;
    if (chartObjects.some((chart) => chart.scaleTooBig(scale))) {
      max = scale;
    } else {
      min = scale;
    }
  }

  chartObjects.forEach((chart) => {
    chart.draw(scale);
    Text.asyncDrawing.forEach((draw) => {
      draw();
    });
    while (Text.asyncDrawing.length > 0) Text.asyncDrawing.pop();
  });

  const promises = chartObjects.map(async (chart) => {
    return new Promise<Blob>((resolve, reject) => {
      try {
        chart.canvas
          .convertToBlob({ type: 'image/png' })
          .then((blob) => resolve(blob))
          .catch((error) => reject(error));
      } catch (error) {
        reject(error);
      }
    });
  });

  try {
    const blobs = await Promise.all(promises);
    return blobs.map((blob) => URL.createObjectURL(blob));
  } catch (error) {
    console.error('Error converting images:', error);
    throw error;
  }
};
