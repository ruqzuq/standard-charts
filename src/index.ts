import { Axis } from './base/Axis';
import { Scenario } from './base/Data';
import { Line } from './base/Line';
import { Rect } from './base/Rect';
import { Text } from './base/Text';
import { ScenarioChart, ScenarioChartProps } from './charts/ScenarioChart';
import { ChartStyle, ChartType } from './charts/Types';
import { VarianceChart, VarianceChartProps } from './charts/VarianceChart';
import { ExtensionType } from './extensions/Types';

export type ChartProps = ScenarioChartProps | VarianceChartProps;

export type Chart = ScenarioChart | VarianceChart;

export { ChartType, ChartStyle, Scenario, ExtensionType };

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
    //
    Line.asyncDraw.forEach((draw) => {
      draw();
    });
    //
    Rect.asyncDraw.forEach((draw) => {
      draw();
    });
    //
    Axis.asyncDraw.forEach((draw) => {
      draw();
    });
    //
    Text.asyncDraw.forEach((draw) => {
      draw();
    });
    // Clear static cache.
    while (Line.asyncDraw.length > 0) Line.asyncDraw.pop();
    while (Rect.asyncDraw.length > 0) Rect.asyncDraw.pop();
    while (Axis.asyncDraw.length > 0) Axis.asyncDraw.pop();
    while (Text.asyncDraw.length > 0) Text.asyncDraw.pop();
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
