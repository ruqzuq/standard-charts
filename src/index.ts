import { ColumnChart, ColumnChartProps } from './charts/ColumnChart';

export enum ChartTypes {
  Column = 'COLUMN',
}

export type ChartProps = ColumnChartProps;

export type Chart = ColumnChart;

/**
 * Return URL of the rendered chart png-images.
 */
export const StandardCharts = async (charts: ChartProps[]) => {
  const chartObjects: Chart[] = [];

  charts.forEach((chart) => {
    switch (chart.chartType) {
      case ChartTypes.Column:
        chartObjects.push(new ColumnChart(chart));
        break;
    }
  });

  let scale;
  let min = 0;
  let max = 10;

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
