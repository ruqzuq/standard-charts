import { ColumnChart, ColumnChartProps } from './charts/ColumnChart';
export declare enum ChartTypes {
    Column = "COLUMN"
}
export type ChartProps = ColumnChartProps;
export type Chart = ColumnChart;
/**
 * Return URL of the rendered chart png-images.
 */
export declare const StandardCharts: (charts: ChartProps[]) => Promise<string[]>;
